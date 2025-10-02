import { ColumnSort } from "../interfaces/column-sort.interface";


const style = 'text-color-white cursor-pointer transition-opacity duration-500 opacity-10 hover:opacity-100';
const icon = 'fa-solid fa-sort fa-lg';
const direction = 'ASC'

export const iconDefault = 'fa-solid fa-sort fa-lg';
const iconAsc = 'fa-solid fa-sort-up fa-lg';
const iconDesc = 'fa-solid fa-sort-down fa-lg';

export const styleDefault = 'text-color-white cursor-pointer transition-opacity duration-500 opacity-10 hover:opacity-100';
const styleSelected = 'text-color-white cursor-pointer';

const MethodsHeader = {
    tableSort(tableHeader: ColumnSort[], index: number): ColumnSort[] {
        // cambiar los valores a index
        if (tableHeader[index].selected) {
            tableHeader[index].direction = tableHeader[index].direction === 'ASC' ? 'DESC' : 'ASC';
            tableHeader[index].icon = tableHeader[index].direction === 'ASC' ? iconAsc : iconDesc;
        } else {
            tableHeader[index].icon = iconAsc
            tableHeader[index].style = styleSelected;
            tableHeader[index].selected = true;
        }


        tableHeader = tableHeader.map((header, i) => {
            if (i !== index) {
                return {
                    ...header,
                    icon: iconDefault,
                    style: styleDefault,
                    sort: 'ASC',
                    selected: false
                };
            } else {
                return {
                    ...header
                };
            }
        });

        return tableHeader;
    },

    getColumn(tableHeader: ColumnSort[], index: number): string {
        return tableHeader[index].column;
    },

    getSearch(tableHeader: ColumnSort[], index: number): string {
        return tableHeader[index].search;
    },

    getIcon(tableHeader: ColumnSort[], index: number): string {
        return tableHeader[index].icon;
    },

    getStyle(tableHeader: ColumnSort[], index: number): string {
        return tableHeader[index].style;
    },

    getDirection(tableHeader: ColumnSort[], index: number): 'ASC' | 'DESC' {
        return tableHeader[index].direction;
    },

    tableDefault(tableHeader: ColumnSort[], index: number): ColumnSort[] {
        tableHeader = tableHeader.map((header, i) => {
            if (i === index) {
                return {
                    ...header,
                    icon: iconAsc,
                    style: styleSelected,
                    sort: 'ASC',
                    selected: true
                };
            } else {
                return {
                    ...header,
                    icon: iconDefault,
                    style: styleDefault,
                    sort: 'ASC',
                    selected: false
                };
            }
        });

        return tableHeader;
    },
};

export { MethodsHeader }