import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CarouselImage from '@/models/CarouselImage';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  await dbConnect();
  const images = await CarouselImage.find().sort('order');
  return NextResponse.json(images);
}

export async function POST(request: Request) {
  await dbConnect();
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const alt = formData.get('alt') as string;
  const order = parseInt(formData.get('order') as string);

  if (!file || !alt || isNaN(order)) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const fileBuffer = await file.arrayBuffer();
    const mime = file.type;
    const encoding = 'base64';
    const base64Data = Buffer.from(fileBuffer).toString('base64');
    const fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;

    const uploadResponse = await cloudinary.uploader.upload(fileUri, {
      folder: 'carousel',
    });

    const newImage = await CarouselImage.create({
      publicId: uploadResponse.public_id,
      url: uploadResponse.secure_url,
      alt,
      order,
    });

    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error('Error creating carousel image:', error);
    return NextResponse.json({ error: 'Failed to create carousel image' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  await dbConnect();
  const { id, alt, order } = await request.json();

  try {
    const updatedImage = await CarouselImage.findByIdAndUpdate(
      id,
      { alt, order },
      { new: true, runValidators: true }
    );
    if (!updatedImage) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
    return NextResponse.json(updatedImage);
  } catch (error) {
    console.error('Error updating carousel image:', error);
    return NextResponse.json({ error: 'Failed to update carousel image' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    const image = await CarouselImage.findById(id);
    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    await cloudinary.uploader.destroy(image.publicId);
    await CarouselImage.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting carousel image:', error);
    return NextResponse.json({ error: 'Failed to delete carousel image' }, { status: 500 });
  }
}

