export class Image {
  path: string;
  text: string;

  constructor(path: string, text: string) {
    this.path = path;
    this.text = text;
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
  }

  removeImageAt(index: number): Image | null {
    if (index < 0 || index >= this.images.length) return null;
    return this.images.splice(index, 1)[0];
  }
}
