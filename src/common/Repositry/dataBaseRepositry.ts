
import { Model, PopulateOptions, QueryFilter, UpdateQuery } from "mongoose";

export class DataBaseRepositry<TRaw> {
  private readonly model: Model<TRaw>;

  constructor(model: Model<TRaw>) {
    this.model = model;
  }

  create(data: Partial<TRaw>) {
    return this.model.create(data);
  }

  findOne({
    filter,
    select,
    populate,
  }: {
    filter: QueryFilter<TRaw>;
    select?: string;
    populate?: PopulateOptions | PopulateOptions[];
  }) {
    let query = this.model.findOne(filter);

    if (select) {
      query = query.select(select);
    }
    if (populate) {
      query = query.populate(populate);
    }
    return query;
  }
  findAll({
    filter,
    select,
    populate
  }:{
    filter:QueryFilter<TRaw>,
    select:string|null,
      populate?: PopulateOptions | PopulateOptions[];
  }){
      let query = this.model.find(filter)
      if(select){
        query = query.select(select)
      }
       if (populate) {
      query = query.populate(populate);
    }
    return query;

  }

  findById({
    id,
    select,
    populate,
  }: {
    id: string;
    select?: string;
    populate?: PopulateOptions | PopulateOptions[];
  }) {
    let query = this.model.findById(id);

    if (select) {
      query = query.select(select);
    }
    if (populate) {
      query = query.populate(populate);
    }
    return query;
  }

 updateOne({
  filter,
  update
 }:{
  filter:QueryFilter<TRaw>;
   update: UpdateQuery<TRaw>;

 }){
  return this.model.updateOne(filter, update);
 }
 updateMany({
  filter,
  update,
}: {
  filter: QueryFilter<TRaw>;
  update: UpdateQuery<TRaw>;
}) {
  return this.model.updateMany(filter, update);
}
 updateById({
  id, update
 }:{id:string , update:UpdateQuery<TRaw>})
 {
  return this.model.findByIdAndUpdate(id , update, {new:true})
 }

deleteOne({filter}:{filter:QueryFilter<TRaw>}){
  return this.model.deleteOne(filter)
}

deleteById({id}:{id:string}){
  return this.model.findByIdAndDelete(id)
}



}



