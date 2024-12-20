import { InferAttributes, InferCreationAttributes } from "sequelize";
import { Column,Model,Table } from "sequelize-typescript";

@Table({ tableName : 'Customers'})  
export class Customer extends Model<InferCreationAttributes<Customer>,InferAttributes<Customer>>{
@Column ({ autoIncrement : true, primaryKey:true})
id:number;

@Column
email:string;

@Column
phoneNumber:number;

@Column
linkedId:number;

@Column
linkPrecedence:string;

// @Column({defaultValue:false})
// is_deleted:boolean;

}