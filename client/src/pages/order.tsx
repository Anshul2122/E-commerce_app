import { ReactElement, useState } from "react";
import TableHOC from "../components/admin/TableHOC"
import { Column } from 'react-table';
import { Link } from "react-router-dom";


type DataType = {
    _id: string,
    amount: number,
    quantity: number,
    discount: number,
    status: ReactElement;
    action:ReactElement
}

const column: Column<DataType>[] = [
  {
    Header: "Id",
    accessor: "_id",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "action",
    accessor: "action",
  },
];
const Order = () => {
    const [rows] = useState<DataType[]>([{
        _id: "kjnda",
        amount: 25454,
        quantity: 34,
        discount: 464,
        status: <span className="red">Processing</span>,
        action: <Link to="/order-details/akgna">view details</Link>,
    }]);
    const Table = TableHOC<DataType>(
        column,
        rows,
        "dashborad-product-box",
        "Orders",
        rows.length>6? true : false,
    )()
  return (
      <div className="container">
          <h1>My Orders</h1>
          {Table}
    </div>
  )
}

export default Order