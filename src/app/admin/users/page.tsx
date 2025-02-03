"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useAppContext } from "@/contexts/AppContext"
import { motion } from "framer-motion"

interface User {
  uid: string
  email: string
  displayName: string
  role: string
}

export default function UsersManagement() {
  const [user] = useAuthState(auth)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserPassword, setNewUserPassword] = useState("")
  const [newUserRole, setNewUserRole] = useState("user")
  const [newUserName, setNewUserName] = useState("")
  const router = useRouter()
  const { theme } = useAppContext()

  useEffect(() => {
    if (user) {
      fetchUsers()
    } else {
      router.push("/admin/login")
    }
  }, [user, router])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/users")
      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }
      const usersData: User[] = await response.json()
      setUsers(usersData)
    } catch (err) {
      console.error("Error fetching users:", err)
      setError("Failed to load users. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (uid: string, newRole: string) => {
    try {
      const response = await fetch("/api/users/update-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, role: newRole }),
      })
      if (!response.ok) {
        throw new Error("Failed to update user role")
      }
      setUsers(users.map((user) => (user.uid === uid ? { ...user, role: newRole } : user)))
    } catch (err) {
      console.error("Error updating user role:", err)
      setError("Failed to update user role. Please try again.")
    }
  }

  const handleDeleteUser = async (uid: string) => {
    try {
      const response = await fetch("/api/users/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
      })
      if (!response.ok) {
        throw new Error("Failed to delete user")
      }
      setUsers(users.filter((user) => user.uid !== uid))
      setSuccess("User deleted successfully!")
    } catch (err) {
      console.error("Error deleting user:", err)
      setError("Failed to delete user. Please try again.")
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess("")
    setError("")

    try {
      const response = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newUserEmail,
          password: newUserPassword,
          role: newUserRole,
          displayName: newUserName,
        }),
      })
      if (!response.ok) {
        throw new Error("Failed to create user")
      }
      setSuccess("User created successfully!")
      fetchUsers()
      setNewUserEmail("")
      setNewUserPassword("")
      setNewUserRole("user")
      setNewUserName("")
    } catch (err) {
      console.error("Error creating user:", err)
      setError("Failed to create user. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`text-center ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
        Loading users...
      </div>
    )
  }

  return (
    <motion.div
      className={`space-y-6 ${theme === "dark" ? "text-white" : "text-gray-800"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.h1
        className="text-2xl font-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        Gestión de Usuarios
      </motion.h1>

      {/* Mensajes de éxito o error */}
      {success && (
        <motion.div
          className="p-4 mb-4 text-green-700 bg-green-100 border border-green-300 rounded"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {success}
        </motion.div>
      )}
      {error && (
        <motion.div
          className="p-4 mb-4 text-red-700 bg-red-100 border border-red-300 rounded"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {error}
        </motion.div>
      )}

      {/* Dialog para agregar usuario */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className={theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"}>
            Add New User
          </Button>
        </DialogTrigger>
        <DialogContent className={theme === "dark" ? "bg-gray-800 text-white" : "bg-white"}>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUser}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">Name</label>
                <Input
                  id="name"
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className={`col-span-3 ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-800"}`}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="email" className="text-right">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className={`col-span-3 ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-800"}`}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="password" className="text-right">Password</label>
                <Input
                  id="password"
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className={`col-span-3 ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-800"}`}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="role" className="text-right">Role</label>
                <Select value={newUserRole} onValueChange={setNewUserRole}>
                  <SelectTrigger className={`col-span-3 ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-800"}`}>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className={theme === "dark" ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"}
              >
                {loading ? "Creating..." : "Add User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Tabla de usuarios */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>Name</TableHead>
              <TableHead className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>Email</TableHead>
              <TableHead className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>Role</TableHead>
              <TableHead className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <motion.tr
                key={user.uid}
                className={theme === "dark" ? "border-gray-700 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-100"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TableCell className={theme === "dark" ? "text-white" : "text-gray-800"}>{user.displayName}</TableCell>
                <TableCell className={theme === "dark" ? "text-white" : "text-gray-800"}>{user.email}</TableCell>
                <TableCell>
                  <Select value={user.role} onValueChange={(value) => handleRoleChange(user.uid, value)}>
                    <SelectTrigger className={`w-[180px] ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-800"}`}>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className={theme === "dark" ? "bg-gray-800 text-white" : "bg-white"}>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                          This action cannot be undone. This will permanently delete the user account and remove their data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className={theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteUser(user.uid)} className="bg-red-600 text-white hover:bg-red-700">Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </motion.div>
  )
}