import React, { useEffect, useState } from "react";
import moment from "moment";
import { add, filter, get, isEmpty } from "lodash";
import { Link } from "react-router-dom/cjs/react-router-dom";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {
  SearchContainer,
  SearchBar,
  SearchIcon,
  SearchInput,
} from "../../components/SearchBar/SearchElements";
import axios from "../../axios";
import { FaSearch } from "react-icons/fa";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Tooltip,
  Button,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  textMiddle: {
    verticalAlign: "middle !important",
    textAlign: "center",
  },
  tablePadding: {
    padding: "5px",
    textAlign: "center",
    fontSize: "0.8rem",
    fontWeight: "800",
  },
  tableContainerHeight: {
    maxHeight: "50vh",
  },
  paperTableHeight: {
    height: "650px",
    width: "95%",
    marginLeft: "2rem",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
  },
  "@media (max-width: 780px)": {
    paperTableHeight: {
      marginLeft: "0.75rem",
    },
  },
  "@media (max-width: 480px)": {
    paperTableHeight: {
      marginLeft: "0.75rem",
    },
  },
  tablePaginationStyle: {
    border: "1px solid #0000001a",
    borderRadius: "0rem 0rem 0.4rem 0.4rem",
    overflowY: "hidden",
  },
  tableFlex: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  searchDesign: {
    borderRadius: "20px",
    boxShadow: "none",
    width: "21%",
  },
}));

const Notification_UserList = (props) => {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);
  const [tableData, setTableData] = useState("");
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();
  const [checkedItems, setCheckedItems] = useState([]);
  const [searchedData, setSearchedData] = useState([]);
  const [searchList, setSearchList] = useState(false);

  const handleCheckboxChange = (id) => {
    // Check if the item is already in the checkedItems array
    const isChecked = checkedItems.includes(id);

    // If it's checked, remove it; otherwise, add it
    setCheckedItems((prevCheckedItems) =>
      isChecked
        ? prevCheckedItems.filter((item) => item !== id)
        : [...prevCheckedItems, id]
    );
  };
  useEffect(() => {
    setCheckedItems(checkedItems);
    props.getData(checkedItems);
    //  console.log(checkedItems, 'this is select')
  }, [checkedItems]);

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleSortRequest = (cellId) => {
    const isAsc = orderBy === cellId && order === "asc";
    const sortedData = stableSort(tableData, getComparator(order, cellId));

    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(cellId);
    setTableData(sortedData); // Update tableData with the sorted result
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const recordsAfterPagingAndSorting = () => {
    // const sortedData = stableSort(tableData, getComparator(order, orderBy));
    const slicedData = tableData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
    return slicedData;
  };
  const mappedData = recordsAfterPagingAndSorting()
console.log(mappedData)


 

  const getUserlist = async (page = 1, rowsPerPage = 15, search = "") => {
    try {
      const token = localStorage.getItem("accessToken");

      const { data } = await axios.get(`/admin/get-users`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const userTableData = data.data.filter((item) => item.role === 'USER');

      // console.log('Users with role USER:', userTableData);
      
      setTableData(userTableData);
      setSearchedData(userTableData);
      
      

      // setPage(page - 1);
      //   console.log(data.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserlist();
  }, []);
  const SearchUser = (searchVal) => {
    setSearchList(true);
    setPage(0);
    // console.log(searchVal.target.value, "this is search val");
    const filteredRows = searchedData.filter((row) => {
      let id = row._id;
      let first_name = row.first_name;
      let email = row.email;

      return (
        first_name
          .toLowerCase()
          .includes(searchVal.target.value.toLowerCase()) ||
        id.includes(searchVal.target.value.toLowerCase()) ||
        email.includes(searchVal.target.value.toLowerCase())
      );
    });
    // console.log(filteredRows, 'this is rows')
    setTableData(filteredRows);
  };
  return (
    <>
      {props.check && (
        <div>
          <div className="d-flex justify-content-end" style={{ width: "100%" }}>
            <SearchContainer
              style={{
                marginBottom: "28px",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                borderRadius: "10px",
              }}
            >
              <SearchBar>
                <SearchIcon>
                  <FaSearch style={{ color: "#c4c4c4" }} />
                </SearchIcon>
                <SearchInput
                  type="text"
                  onChange={(searchVal) => SearchUser(searchVal)}
                  placeholder="Search by Name, Email & Id"
                ></SearchInput>
              </SearchBar>
            </SearchContainer>
          </div>
          <div className="border">
            <TableContainer className={classes.tableContainerHeight}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {props.check && (
                      <TableCell className={classes.tablePadding}>
                        Select
                      </TableCell>
                    )}
                    <TableCell
                      className={classes.tablePadding}
                      style={{ fontWeight: "800" }}
                    >
                      S.&nbsp;No.
                    </TableCell>
                    <TableCell className={classes.tablePadding}>Name</TableCell>
                    <TableCell className={classes.tablePadding}>
                      User Id
                    </TableCell>
                    <TableCell className={classes.tablePadding}>
                      Email Address
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* {console.log(tableData, "this is data")} */}
                  {mappedData.map((category, index) => {
                  
                      return (
                        <TableRow key={category.id}>
                          <TableCell
                            component="th"
                            scope="row"
                            className={classes.textMiddle}
                          >
                            <div>
                              <input
                                type="checkbox"
                                id={category._id}
                                checked={checkedItems.includes(category._id)}
                                onChange={() =>
                                  handleCheckboxChange(category._id)
                                }
                              />
                            </div>
                          </TableCell>
  
                          <TableCell className={classes.textMiddle}>
                            {index + 1 + page * rowsPerPage}
                          </TableCell>
  
                          <TableCell className={classes.textMiddle}>
                            <div>
                              {get(category, "first_name", "")}{" "}
                              {get(category, "last_name", "")}
                              {/* {get(category," " + "last_name", "N/A").slice(-4)} */}
                            </div>
                          </TableCell>
                          {/* <TableCell className={classes.textMiddle}>
                          <div>{get(category, "first_name", "N/A").slice(-4)}</div>
                        </TableCell> */}
                          <TableCell className={classes.textMiddle}>
                            <div>{get(category, "_id", "N/A")}</div>
                          </TableCell>
                          <TableCell className={classes.textMiddle}>
                            <div>{get(category, "email", "N/A")}</div>
                          </TableCell>
                        </TableRow>
                      );
                    
                 
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              className={classes.tablePaginationStyle}
              rowsPerPageOptions={[15, 25, 100]}
              component="div"
              count={tableData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Notification_UserList;
