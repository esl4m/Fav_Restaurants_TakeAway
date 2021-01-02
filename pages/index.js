import Head from 'next/head'
import styles from '../styles/Home.module.css'
import ResturantsSDK from "../utils/ResturantsSDK";
import restaurantsList from "../resturants.json";

import React, { useState, useEffect } from "react";
import Container from "@material-ui/core/Container";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import InputBase from "@material-ui/core/InputBase";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";

import FavoriteIcon from "@material-ui/icons/Favorite";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    margin: 20
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: "100%"
  }
}));

const sortFields = [
  {key : "bestMatch", value : "Best Match"},
  {key : "newest", value : "Newest"},
  {key : "ratingAverage", value : "Rating"},
  {key : "distance", value : "distance"},
  {key : "averageProductPrice", value : "ProductPrice"},
  {key : "deliveryCosts", value : "delivery Costs"},
  {key : "minCost", value : "minimum Cost"}
];

export default function Home() {

  const classes = useStyles();
  const [sort, setSort] = useState(sortFields[0].key);
  const [keyword, setKeyword] = useState("");
  const [restaurants, setSrestaurants] = useState([]);
  const resturantsSDK = new ResturantsSDK(restaurantsList.restaurants);

  const fetchData = () => {
    const res = resturantsSDK.list({
      keyword,
      sortBy: sort
    });
    setSrestaurants(res || []);
  };

  // fetching data -> componentDidMount & updating data [sort, keyword] -> componentDidUpdate
  useEffect(fetchData, [sort, keyword]);

  function handleSetSort(event) {
    setSort(event.target.value);
  }

  function handleSetKeyword(event) {
    setKeyword(event.target.value);
  }

  function handleAddFav({ name }) {
    resturantsSDK.addFav(name);
    fetchData();
  }

  function handleRemoveFav({ name }) {
    resturantsSDK.removeFav(name);
    fetchData();
  }

  return (
    <React.Fragment>
      <Head>
        <title>Restaurants App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Resturants App</h1>
        <p className={styles.description}></p>
        
        <Container maxWidth="md">
          <form  noValidate autoComplete="off">
            <Grid container xs={12}>
              <Grid item xs={9}>
                <InputBase
                  onInput={handleSetKeyword}
                  value={keyword}
                  placeholder="Search..."
                  inputProps={{ "aria-label": "search..." }} />
              </Grid>
              <Grid item xs={3}>
                <FormControl >
                  <InputLabel id="sort-label">SORT</InputLabel>
                  <Select labelId="sort-label" id="sort-select" value={sort} onChange={handleSetSort}>
                    {sortFields.map((field) => (
                      <MenuItem value={field.key}>{field.value}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </form>

          <List>
            {restaurants.map((resturant) => (
              <ListItem alignItems="flex-start">
                <ListItemText primary={resturant.name}
                  secondary={
                    <React.Fragment>
                      {resturant.status}
                    </React.Fragment>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={resturant.favorite ? () => handleRemoveFav(resturant) : () => handleAddFav(resturant)} 
                    aria-label="Add favorites"
                    color={resturant.favorite ? "primary" : "default"}>
                    <FavoriteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Container>
      </main>

      <footer className={styles.footer}></footer>
    </React.Fragment>
  )
}
