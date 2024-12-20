import { InferAttributes, InferCreationAttributes } from "sequelize";
import { Column,Model,Table } from "sequelize-typescript";

@Table({ tableName : 'Customers'})  
export class Customer extends Model<InferCreationAttributes<Customer>,InferAttributes<Customer>>{
@Column ({ autoIncrement : true, primaryKey:true})
id:number;

@Column
customer_email:string;

@Column
mobile_no:string;

@Column
linkedId:number;

@Column
linkPrecedence:string;

}