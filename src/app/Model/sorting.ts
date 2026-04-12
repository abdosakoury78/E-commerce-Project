import { Product } from "./product";
import { sortingType } from "./sortingType";

export interface Sorting {
    selectSorting(products : Product[]) : Product[];
}

export class DefaultSorting implements Sorting {
    selectSorting(products : Product[]): Product[] {
        return [...products].sort((a, b) => a.id - b.id);
    }

}

export class SortByPriceLowToHigh implements Sorting {
    selectSorting(products : Product[]): Product[] {
        return [...products].sort((a, b) => a.price - b.price);
    }
}

export class SortByPriceHighToLow implements Sorting {
    selectSorting(products : Product[]): Product[] {
        return [...products].sort((a, b) => b.price - a.price);
    }
}

export class SortByRating implements Sorting {
    selectSorting(products : Product[]): Product[] {
        return [...products].sort((a, b) => b.rating - a.rating);
    }
}

const sortingMap: Record<sortingType, new () => Sorting> = {
    [sortingType.LowToHigh]: SortByPriceLowToHigh,
    [sortingType.HighToLow]: SortByPriceHighToLow,
    [sortingType.Rating]: SortByRating,
    [sortingType.Default]: DefaultSorting
};

export class SortingFactory {
    static createSorting(type: sortingType): Sorting {
        const SortingClass = sortingMap[type] || DefaultSorting;
        return new SortingClass();
    }
}
