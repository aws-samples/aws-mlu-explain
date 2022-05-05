export default function getPadFunctions(scale: any): {
    lift: (x: any) => number;
    ground: (x: any) => number;
    scaleType: string;
} | {
    lift: typeof identity;
    ground: typeof identity;
    scaleType: string;
};
import identity from "../utils/identity.js";
