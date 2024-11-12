'use client'

import Image from 'next/image';
import { motion } from 'framer-motion';

export function Historia() {
  return (
    <section id="historia" className="py-20 bg-background">
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        <motion.div
          className="md:w-1/2 md:pr-8 mb-8 md:mb-0"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4 text-primary">Nuestra Historia</h2>
          <p className="text-text mb-4">
            La Iglesia Pentecostal Apostólica Las Encinas tiene sus raíces en la comunidad local...
            Somos una Iglesia Pentecostal que quiere mantenerse fiel a la Biblia y ser continuadora del ministerio terrenal de Cristo.
            Una Iglesia que adora a Dios con libertad, donde la familia es la base de las actividades y en la que cada miembro contribuye con sus dones y talentos al logro de metas y objetivos bajo la unción y dirección del Espíritu Santo.
          </p>
        </motion.div>
        <motion.div
          className="md:w-1/2"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="overflow-hidden rounded-lg shadow-lg">
            <Image
              src="/encuentromujeres.webp"
              alt="Historia de IPA Las Encinas"
              width={600}
              height={400}
              className="w-full h-auto transition-transform duration-300 hover:scale-105"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
