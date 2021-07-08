export class EventData {
  type: string = '';
  date: Date = new Date();
  title: string = '';
  comments: string = '';
  rating: number = 0;
  location: string = '';
  image: File = new File([],'');
  imageStr: string | null = '';
}
