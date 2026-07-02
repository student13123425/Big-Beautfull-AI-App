export class Image {
  path: string;
  text: string;
  order: number;

  constructor(path: string, text: string, order: number) {
    this.path = path;
    this.text = text;
    this.order = order;
  }
}

export class ImageGroup {
  title: string;
  images: Image[];

  constructor(title: string, images?: Image[]) {
    this.title = title;
    this.images = images || [];
  }

  addImage(image: Image): void {
    this.images.push(image);
    this.images.sort((a, b) => a.order - b.order);
  }

  removeImageAt(index: number): Image | null {
    if (index < 0 || index >= this.images.length) return null;
    return this.images.splice(index, 1)[0];
  }
}
