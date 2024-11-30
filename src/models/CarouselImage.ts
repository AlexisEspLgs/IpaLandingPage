import mongoose from 'mongoose';

const CarouselImageSchema = new mongoose.Schema({
  publicId: { type: String, required: true },
  url: { type: String, required: true },
  alt: { type: String, required: true },
  order: { type: Number, required: true },
});

export default mongoose.models.CarouselImage || mongoose.model('CarouselImage', CarouselImageSchema);

