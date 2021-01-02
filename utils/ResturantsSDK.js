class ResturantsSDK {

    resturants = [];
    result = [];
    favorites = [];

    constructor(resturants) {
        this.resturants = resturants;
        this.result = resturants;

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

}

export default ResturantsSDK;
