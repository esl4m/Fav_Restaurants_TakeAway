class ResturantsSDK {

    resturants = [];
    result = [];
    favorites = [];

    constructor(resturants) {
        this.resturants = resturants;
        this.result = resturants;
        this.sort("bestMatch");  // Load the default sort: sort by "bestMatch"
        if (typeof window === "undefined") return this;
        if (!localStorage.favorites) localStorage.setItem("favorites", "");
        this.favorites = localStorage.favorites.split(",");
    }

    /**
     * Set the fav resturant in local storage
     */
    addFav(name) {
        const index = this.favorites.indexOf(name);
        if (index !== -1) return this;
        localStorage.favorites += `${localStorage.favorites && ","}${name}`;
        this.favorites.push(name);
        return this;
    }

    /**
     * Remove the fav resturant from local storage
     */
    removeFav(name) {
        const index = this.favorites.indexOf(name);
        if (index === -1) return this;
        this.favorites.splice(index, 1);
        localStorage.favorites = this.favorites.join(",");
        return this;
    }

    /**
     * List all resturants
     */
    list({ keyword, sortBy }) {
        this.filter(keyword).sort(sortBy || "bestMatch");
        const { favorites, normal } = this.result.reduce(
            (accumulator, resturant) => {
                if (this.favorites.includes(resturant.name)) {
                resturant.favorite = true;
                accumulator.favorites.push(resturant);
                return accumulator;
                }
                resturant.favorite = false;
                accumulator.normal.push(resturant);
                return accumulator;
            },
            { favorites: [], normal: [] }
        );
        return favorites.concat(normal);
    }

    /**
     * Sort resturants by keyword
     */
    sort(sortBy) {
        // -- bestmatch by default (descending) -- //
        const asc = [
            "newest",
            "distance",
            "averageProductPrice",
            "deliveryCosts",
            "minCost"
        ];

        // if (returned value > 0) then the position of a and b is swapped.
        // if (returned value <=0) then there is no change in position.
        this.result.sort((a, b) => {
            if (a.status === "open" && b.status !== "open") {
                return -1;
            }

            if (a.status !== "open" && b.status === "open") {
                return 1;
            }

            if (a.status === b.status) {
                if (asc.includes(sortBy)) {
                    return a.sortingValues[sortBy] - b.sortingValues[sortBy];
                }
                return b.sortingValues[sortBy] - a.sortingValues[sortBy];
            }

            if (a.status === "order ahead" && b.status !== "order ahead") {
                return -1;
            }
            // else
            return 1;
        });
        return this;
    }

    /**
     * Filter resturants by keyword
     */
    filter(keyword) {
        if (!keyword) {
            this.result = this.resturants;
            return this;
        }
        this.result = this.resturants.filter(({ name }) =>
            name.toLowerCase().includes(keyword.toLowerCase())
        );
        return this;
    }
}

export default ResturantsSDK;
