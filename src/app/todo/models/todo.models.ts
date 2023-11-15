export class Todo{
  constructor(
    public id:number,
    public content:string,
    public date:string,
    public checkComplete: boolean = false
  ){}
}
