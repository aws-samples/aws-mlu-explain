// This is the perimeters in the dataset dividied by 10.
// Only showing the ones in the test set!
export const circles = [
  { r: 36.93530064 },
  { r: 31.58115748 },
  { r: 29.53789232 },
  { r: 16.67522915 },
  { r: 15.28719486 },
  { r: 13.27763958 },
  { r: 13.1465753 },
  { r: 13.1144231 },
  { r: 13.00692153 },
  { r: 12.54294165 },
  { r: 12.35622283 },
  { r: 12.33625981 },
  { r: 12.22043929 },
  { r: 12.08593685 },
  { r: 11.98407489 },
  { r: 11.94722608 },
  { r: 11.81671061 },
  { r: 11.79147465 },
  { r: 11.78716606 },
  { r: 11.72418887 },
  { r: 11.67611949 },
  { r: 11.55856364 },
  { r: 11.52822328 },
  { r: 11.51608779 },
  { r: 11.50675537 },
  { r: 11.49364791 },
  { r: 11.38186266 },
  { r: 11.31723912 },
  { r: 11.23533066 },
  { r: 11.1106768 },
  { r: 11.04819277 },
  { r: 10.89921353 },
  { r: 10.87802699 },
  { r: 10.81782353 },
  { r: 10.52921507 },
  { r: 10.51118448 },
  { r: 10.41425283 },
  { r: 10.41161124 },
  { r: 10.39930965 },
  { r: 10.37983396 },
  { r: 10.27551588 },
  { r: 10.24967472 },
  { r: 10.15662696 },
  { r: 10.12055869 },
  { r: 9.995552755 },
  { r: 9.943864197 },
  { r: 9.899124163 },
  { r: 9.823660167 },
  { r: 9.770795531 },
  { r: 9.639381241 },
  { r: 9.544537502 },
  { r: 9.494263237 },
  { r: 9.328736177 },
  { r: 9.300967068 },
  { r: 9.206633591 },
  { r: 9.01812878 },
  { r: 8.902701696 },
  { r: 8.893075216 },
  { r: 8.777496519 },
  { r: 8.733214543 },
  { r: 8.670041986 },
  { r: 8.627872275 },
  { r: 8.612926855 },
  { r: 8.553521039 },
  { r: 8.199296667 },
  { r: 8.174274346 },
  { r: 7.982468553 },
  { r: 7.867339675 },
  { r: 7.266213478 },
  { r: 7.185587187 },
  { r: 6.913827817 },
  { r: 6.872638394 },
  { r: 6.835506106 },
  { r: 6.708873459 },
  { r: 6.406202593 },
  { r: 5.961718653 },
  { r: 5.831822923 },
  { r: 5.476431637 },
  { r: 5.29819255 },
  { r: 4.9615785 },
  { r: 3.819911053 },
];
export const sample1 = [0, 1, 6, 10, 17, 25, 31, 43, 54, 60, 70, 75, 77, 79];
export const sample2 = [1, 2, 17, 22, 30, 35, 37, 40, 51, 55, 60, 65, 71, 72];
export const sample3 = [0, 2, 6, 10, 25, 32, 41, 52, 64, 68, 72, 76, 79, 80];

// New data with just 9 trees!
export const barcodeData = [
  {
    accuracy: 0.9714285714,
    feature1: 0.2368011934,
    feature2: 0.1950235463,
    feature3: 0.2217098971,
    feature4: 0.3464653632,
  },
  {
    accuracy: 0.9142857143,
    feature1: 0.5713653981,
    feature2: 0.40149377,
    feature3: 0.0271408319,
    feature4: 0.0,
  },
  {
    accuracy: 0.9428571429,
    feature1: 0.2890916373,
    feature2: 0.0,
    feature3: 0.2229451558,
    feature4: 0.4879632069,
  },
  {
    accuracy: 0.4571428571,
    feature1: 0.2614603287,
    feature2: 0.2118514114,
    feature3: 0.1444410557,
    feature4: 0.3822472042,
  },
  {
    accuracy: 0.8571428571,
    feature1: 0.099606929,
    feature2: 0.0,
    feature3: 0.5407975405,
    feature4: 0.3595955304,
  },
  {
    accuracy: 0.7714285714,
    feature1: 0.1490434863,
    feature2: 0.1900792207,
    feature3: 0.3279306887,
    feature4: 0.3329466042,
  },
  {
    accuracy: 0.9142857143,
    feature1: 0.3508435857,
    feature2: 0.2081550448,
    feature3: 0.2880505394,
    feature4: 0.1529508302,
  },
  {
    accuracy: 0.6571428571,
    feature1: 0.1933477071,
    feature2: 0.3074514238,
    feature3: 0.0922200738,
    feature4: 0.4069807952,
  },
  {
    accuracy: 0.8571428571,
    feature1: 0.2164516682,
    feature2: 0.3081953845,
    feature3: 0.3518631879,
    feature4: 0.1234897594,
  },
  {
    accuracy: 0.6285714286,
    feature1: 0.0,
    feature2: 0.1279856615,
    feature3: 0.0,
    feature4: 0.8720143385,
  },
];

//Random Forest data for Cantor Chart
//pd: prediction, 1 for yes, 0 for no.
//id: id for the datapoint
//c: correctness, 1 for correct, 0 for incorrect.
export const rf = [
  { pd: 1, id: 93, c: 0 },
  { pd: 1, id: 43, c: 1 },
  { pd: 1, id: 34, c: 1 },
  { pd: 1, id: 52, c: 1 },
  { pd: 0, id: 110, c: 1 },
  { pd: 1, id: 46, c: 1 },
  { pd: 0, id: 58, c: 1 },
  { pd: 1, id: 17, c: 1 },
  { pd: 0, id: 114, c: 1 },
  { pd: 0, id: 101, c: 1 },
  { pd: 1, id: 35, c: 1 },
  { pd: 0, id: 81, c: 1 },
  { pd: 1, id: 1, c: 1 },
  { pd: 1, id: 13, c: 1 },
  { pd: 0, id: 109, c: 1 },
  { pd: 1, id: 5, c: 1 },
  { pd: 0, id: 107, c: 1 },
  { pd: 0, id: 64, c: 1 },
  { pd: 0, id: 85, c: 1 },
  { pd: 1, id: 36, c: 1 },
  { pd: 0, id: 106, c: 1 },
  { pd: 1, id: 26, c: 1 },
  { pd: 0, id: 104, c: 1 },
  { pd: 0, id: 75, c: 1 },
  { pd: 1, id: 10, c: 1 },
  { pd: 1, id: 29, c: 1 },
  { pd: 0, id: 103, c: 1 },
  { pd: 1, id: 31, c: 1 },
  { pd: 0, id: 113, c: 1 },
];
export const tree0 = [
  { pd: 1, id: 93, c: 0 },
  { pd: 0, id: 43, c: 0 },
  { pd: 1, id: 34, c: 1 },
  { pd: 1, id: 52, c: 1 },
  { pd: 0, id: 110, c: 1 },
  { pd: 1, id: 46, c: 1 },
  { pd: 0, id: 58, c: 1 },
  { pd: 1, id: 17, c: 1 },
  { pd: 0, id: 114, c: 1 },
  { pd: 0, id: 101, c: 1 },
  { pd: 1, id: 35, c: 1 },
  { pd: 0, id: 81, c: 1 },
  { pd: 1, id: 1, c: 1 },
  { pd: 1, id: 13, c: 1 },
  { pd: 0, id: 109, c: 1 },
  { pd: 1, id: 5, c: 1 },
  { pd: 0, id: 107, c: 1 },
  { pd: 0, id: 64, c: 1 },
  { pd: 0, id: 85, c: 1 },
  { pd: 1, id: 36, c: 1 },
  { pd: 0, id: 106, c: 1 },
  { pd: 1, id: 26, c: 1 },
  { pd: 0, id: 104, c: 1 },
  { pd: 0, id: 75, c: 1 },
  { pd: 1, id: 10, c: 1 },
  { pd: 1, id: 29, c: 1 },
  { pd: 0, id: 103, c: 1 },
  { pd: 1, id: 31, c: 1 },
  { pd: 0, id: 113, c: 1 },
];
export const tree1 = [
  { pd: 0, id: 93, c: 1 },
  { pd: 1, id: 43, c: 1 },
  { pd: 1, id: 34, c: 1 },
  { pd: 1, id: 52, c: 1 },
  { pd: 0, id: 110, c: 1 },
  { pd: 1, id: 46, c: 1 },
  { pd: 0, id: 58, c: 1 },
  { pd: 1, id: 17, c: 1 },
  { pd: 0, id: 114, c: 1 },
  { pd: 0, id: 101, c: 1 },
  { pd: 1, id: 35, c: 1 },
  { pd: 0, id: 81, c: 1 },
  { pd: 1, id: 1, c: 1 },
  { pd: 1, id: 13, c: 1 },
  { pd: 0, id: 109, c: 1 },
  { pd: 1, id: 5, c: 1 },
  { pd: 0, id: 107, c: 1 },
  { pd: 0, id: 64, c: 1 },
  { pd: 0, id: 85, c: 1 },
  { pd: 1, id: 36, c: 1 },
  { pd: 0, id: 106, c: 1 },
  { pd: 1, id: 26, c: 1 },
  { pd: 0, id: 104, c: 1 },
  { pd: 0, id: 75, c: 1 },
  { pd: 1, id: 10, c: 1 },
  { pd: 1, id: 29, c: 1 },
  { pd: 1, id: 103, c: 0 },
  { pd: 1, id: 31, c: 1 },
  { pd: 0, id: 113, c: 1 },
];
export const tree2 = [
  { pd: 1, id: 93, c: 0 },
  { pd: 1, id: 43, c: 1 },
  { pd: 1, id: 34, c: 1 },
  { pd: 1, id: 52, c: 1 },
  { pd: 1, id: 110, c: 0 },
  { pd: 1, id: 46, c: 1 },
  { pd: 1, id: 58, c: 0 },
  { pd: 1, id: 17, c: 1 },
  { pd: 1, id: 114, c: 0 },
  { pd: 1, id: 101, c: 0 },
  { pd: 1, id: 35, c: 1 },
  { pd: 1, id: 81, c: 0 },
  { pd: 1, id: 1, c: 1 },
  { pd: 1, id: 13, c: 1 },
  { pd: 1, id: 109, c: 0 },
  { pd: 0, id: 5, c: 0 },
  { pd: 1, id: 107, c: 0 },
  { pd: 1, id: 64, c: 0 },
  { pd: 0, id: 85, c: 1 },
  { pd: 1, id: 36, c: 1 },
  { pd: 1, id: 106, c: 0 },
  { pd: 1, id: 26, c: 1 },
  { pd: 1, id: 104, c: 0 },
  { pd: 1, id: 75, c: 0 },
  { pd: 0, id: 10, c: 0 },
  { pd: 0, id: 29, c: 0 },
  { pd: 1, id: 103, c: 0 },
  { pd: 1, id: 31, c: 1 },
  { pd: 1, id: 113, c: 0 },
];
export const tree3 = [
  { pd: 1, id: 93, c: 0 },
  { pd: 1, id: 43, c: 1 },
  { pd: 1, id: 34, c: 1 },
  { pd: 1, id: 52, c: 1 },
  { pd: 0, id: 110, c: 1 },
  { pd: 1, id: 46, c: 1 },
  { pd: 0, id: 58, c: 1 },
  { pd: 1, id: 17, c: 1 },
  { pd: 0, id: 114, c: 1 },
  { pd: 1, id: 101, c: 0 },
  { pd: 1, id: 35, c: 1 },
  { pd: 0, id: 81, c: 1 },
  { pd: 1, id: 1, c: 1 },
  { pd: 1, id: 13, c: 1 },
  { pd: 0, id: 109, c: 1 },
  { pd: 1, id: 5, c: 1 },
  { pd: 0, id: 107, c: 1 },
  { pd: 0, id: 64, c: 1 },
  { pd: 0, id: 85, c: 1 },
  { pd: 1, id: 36, c: 1 },
  { pd: 0, id: 106, c: 1 },
  { pd: 1, id: 26, c: 1 },
  { pd: 0, id: 104, c: 1 },
  { pd: 1, id: 75, c: 0 },
  { pd: 1, id: 10, c: 1 },
  { pd: 1, id: 29, c: 1 },
  { pd: 0, id: 103, c: 1 },
  { pd: 1, id: 31, c: 1 },
  { pd: 0, id: 113, c: 1 },
];
export const tree4 = [
  { pd: 0, id: 93, c: 1 },
  { pd: 0, id: 43, c: 0 },
  { pd: 0, id: 34, c: 0 },
  { pd: 1, id: 52, c: 1 },
  { pd: 0, id: 110, c: 1 },
  { pd: 0, id: 46, c: 0 },
  { pd: 0, id: 58, c: 1 },
  { pd: 1, id: 17, c: 1 },
  { pd: 0, id: 114, c: 1 },
  { pd: 0, id: 101, c: 1 },
  { pd: 1, id: 35, c: 1 },
  { pd: 0, id: 81, c: 1 },
  { pd: 1, id: 1, c: 1 },
  { pd: 1, id: 13, c: 1 },
  { pd: 0, id: 109, c: 1 },
  { pd: 0, id: 5, c: 0 },
  { pd: 0, id: 107, c: 1 },
  { pd: 0, id: 64, c: 1 },
  { pd: 0, id: 85, c: 1 },
  { pd: 0, id: 36, c: 0 },
  { pd: 0, id: 106, c: 1 },
  { pd: 1, id: 26, c: 1 },
  { pd: 0, id: 104, c: 1 },
  { pd: 0, id: 75, c: 1 },
  { pd: 0, id: 10, c: 0 },
  { pd: 0, id: 29, c: 0 },
  { pd: 0, id: 103, c: 1 },
  { pd: 0, id: 31, c: 0 },
  { pd: 0, id: 113, c: 1 },
];
export const tree5 = [
  { pd: 1, id: 93, c: 0 },
  { pd: 1, id: 43, c: 1 },
  { pd: 1, id: 34, c: 1 },
  { pd: 1, id: 52, c: 1 },
  { pd: 0, id: 110, c: 1 },
  { pd: 1, id: 46, c: 1 },
  { pd: 0, id: 58, c: 1 },
  { pd: 1, id: 17, c: 1 },
  { pd: 0, id: 114, c: 1 },
  { pd: 1, id: 101, c: 0 },
  { pd: 1, id: 35, c: 1 },
  { pd: 0, id: 81, c: 1 },
  { pd: 1, id: 1, c: 1 },
  { pd: 1, id: 13, c: 1 },
  { pd: 0, id: 109, c: 1 },
  { pd: 1, id: 5, c: 1 },
  { pd: 0, id: 107, c: 1 },
  { pd: 0, id: 64, c: 1 },
  { pd: 0, id: 85, c: 1 },
  { pd: 1, id: 36, c: 1 },
  { pd: 0, id: 106, c: 1 },
  { pd: 1, id: 26, c: 1 },
  { pd: 0, id: 104, c: 1 },
  { pd: 0, id: 75, c: 1 },
  { pd: 1, id: 10, c: 1 },
  { pd: 1, id: 29, c: 1 },
  { pd: 0, id: 103, c: 1 },
  { pd: 1, id: 31, c: 1 },
  { pd: 0, id: 113, c: 1 },
];
export const tree6 = [
  { pd: 1, id: 93, c: 0 },
  { pd: 1, id: 43, c: 1 },
  { pd: 1, id: 34, c: 1 },
  { pd: 1, id: 52, c: 1 },
  { pd: 0, id: 110, c: 1 },
  { pd: 1, id: 46, c: 1 },
  { pd: 0, id: 58, c: 1 },
  { pd: 1, id: 17, c: 1 },
  { pd: 1, id: 114, c: 0 },
  { pd: 1, id: 101, c: 0 },
  { pd: 1, id: 35, c: 1 },
  { pd: 0, id: 81, c: 1 },
  { pd: 1, id: 1, c: 1 },
  { pd: 1, id: 13, c: 1 },
  { pd: 0, id: 109, c: 1 },
  { pd: 1, id: 5, c: 1 },
  { pd: 1, id: 107, c: 0 },
  { pd: 0, id: 64, c: 1 },
  { pd: 1, id: 85, c: 0 },
  { pd: 1, id: 36, c: 1 },
  { pd: 1, id: 106, c: 0 },
  { pd: 1, id: 26, c: 1 },
  { pd: 1, id: 104, c: 0 },
  { pd: 0, id: 75, c: 1 },
  { pd: 1, id: 10, c: 1 },
  { pd: 1, id: 29, c: 1 },
  { pd: 1, id: 103, c: 0 },
  { pd: 1, id: 31, c: 1 },
  { pd: 1, id: 113, c: 0 },
];
export const tree7 = [
  { pd: 1, id: 93, c: 0 },
  { pd: 0, id: 43, c: 0 },
  { pd: 1, id: 34, c: 1 },
  { pd: 1, id: 52, c: 1 },
  { pd: 0, id: 110, c: 1 },
  { pd: 1, id: 46, c: 1 },
  { pd: 0, id: 58, c: 1 },
  { pd: 1, id: 17, c: 1 },
  { pd: 0, id: 114, c: 1 },
  { pd: 0, id: 101, c: 1 },
  { pd: 1, id: 35, c: 1 },
  { pd: 0, id: 81, c: 1 },
  { pd: 1, id: 1, c: 1 },
  { pd: 1, id: 13, c: 1 },
  { pd: 0, id: 109, c: 1 },
  { pd: 1, id: 5, c: 1 },
  { pd: 0, id: 107, c: 1 },
  { pd: 0, id: 64, c: 1 },
  { pd: 0, id: 85, c: 1 },
  { pd: 1, id: 36, c: 1 },
  { pd: 0, id: 106, c: 1 },
  { pd: 1, id: 26, c: 1 },
  { pd: 0, id: 104, c: 1 },
  { pd: 1, id: 75, c: 0 },
  { pd: 1, id: 10, c: 1 },
  { pd: 1, id: 29, c: 1 },
  { pd: 0, id: 103, c: 1 },
  { pd: 1, id: 31, c: 1 },
  { pd: 0, id: 113, c: 1 },
];
export const tree8 = [
  { pd: 0, id: 93, c: 1 },
  { pd: 0, id: 43, c: 0 },
  { pd: 1, id: 34, c: 1 },
  { pd: 1, id: 52, c: 1 },
  { pd: 0, id: 110, c: 1 },
  { pd: 0, id: 46, c: 0 },
  { pd: 0, id: 58, c: 1 },
  { pd: 1, id: 17, c: 1 },
  { pd: 1, id: 114, c: 0 },
  { pd: 0, id: 101, c: 1 },
  { pd: 1, id: 35, c: 1 },
  { pd: 1, id: 81, c: 0 },
  { pd: 1, id: 1, c: 1 },
  { pd: 1, id: 13, c: 1 },
  { pd: 0, id: 109, c: 1 },
  { pd: 0, id: 5, c: 0 },
  { pd: 1, id: 107, c: 0 },
  { pd: 1, id: 64, c: 0 },
  { pd: 0, id: 85, c: 1 },
  { pd: 0, id: 36, c: 0 },
  { pd: 0, id: 106, c: 1 },
  { pd: 1, id: 26, c: 1 },
  { pd: 0, id: 104, c: 1 },
  { pd: 0, id: 75, c: 1 },
  { pd: 0, id: 10, c: 0 },
  { pd: 0, id: 29, c: 0 },
  { pd: 1, id: 103, c: 0 },
  { pd: 0, id: 31, c: 0 },
  { pd: 0, id: 113, c: 1 },
];

export const trees = [
  tree0,
  tree1,
  tree2,
  tree3,
  tree4,
  tree5,
  tree6,
  tree7,
  tree8,
];
//
export const featureLabelsData = [
  { text: "Size", label: "S", color: "#feeca9" },
  { text: "# Sides", label: "N", color: "#e99f46" },
  { text: "# Colors", label: "C", color: "#005da3" },
  { text: "Text or Symbol", label: "T", color: "#ce3874" },
];
// Three trees to show in RF section.
export const RFTree4 = {
  id: "0",
  children: [
    {
      id: "1",
      children: [
        {
          id: "3",
          children: [
            {
              id: "5",
              impurity: "0.0",
              samples: "11",
              value: "[ 0. 20.]",
              class: "1",
            },
            {
              id: "6",
              children: [
                {
                  id: "7",
                  impurity: "0.0",
                  samples: "5",
                  value: "[6. 0.]",
                  class: "0",
                },
                {
                  id: "8",
                  impurity: "0.0",
                  samples: "2",
                  value: "[0. 2.]",
                  class: "1",
                },
              ],
              name: "Number of Sides",
              value: 4.5,
              color: "#e99f46",
              impurity: "0.8112781244591328",
              samples: "7",
            },
          ],
          name: "Perimeter",
          value: 97.0509,
          color: "#feeca9",
          impurity: "0.74959525725948",
          samples: "18",
        },
        {
          id: "4",
          children: [
            {
              id: "9",
              impurity: "0.0",
              samples: "3",
              value: "[5. 0.]",
              class: "0",
            },
            {
              id: "10",
              impurity: "0.9418285354475157",
              samples: "25",
              value: "[25. 14.]",
              class: "0",
            },
          ],
          name: "Text or Symbol",
          value: 1.5,
          color: "#ce3874",
          impurity: "0.9023932827949789",
          samples: "28",
        },
      ],
      name: "Text or Symbol",
      value: 0.5,
      color: "#ce3874",
      impurity: "1.0",
      samples: "46",
      split: "2",
    },
    { id: "2", impurity: "0.0", samples: "7", value: "[9. 0.]", class: "0" },
  ],
  name: "Number of Colors",
  value: 3.5,
  color: "#005da3",
  impurity: "0.9910760598382222",
  samples: "53",
  split: "1",
};
export const RFTree5 = {
  id: "0",
  children: [
    {
      id: "1",
      children: [
        {
          id: "5",
          impurity: "0.4689955935892812",
          samples: "14",
          value: "[ 2. 18.]",
          class: "1",
        },
        {
          id: "6",
          impurity: "0.0",
          samples: "3",
          value: "[4. 0.]",
          class: "0",
        },
      ],
      name: "Number of Colors",
      value: 3.5,
      color: "#005da3",
      impurity: "0.8112781244591328",
      samples: "17",
    },
    {
      id: "2",
      children: [
        {
          id: "3",
          impurity: "0.3809465857053901",
          samples: "15",
          value: "[25.  2.]",
          class: "0",
        },
        {
          id: "4",
          children: [
            {
              id: "7",
              impurity: "0.0",
              samples: "3",
              value: "[4. 0.]",
              class: "0",
            },
            {
              id: "8",
              children: [
                {
                  id: "9",
                  impurity: "0.5586293734521992",
                  samples: "13",
                  value: "[ 3. 20.]",
                  class: "1",
                },
                {
                  id: "10",
                  impurity: "0.0",
                  samples: "1",
                  value: "[3. 0.]",
                  class: "0",
                },
              ],
              name: "Perimeter",
              value: 149.7643,
              color: "#feeca9",
              impurity: "0.7793498372920852",
              samples: "14",
            },
          ],
          name: "Text or Symbol",
          value: 1.5,
          color: "#ce3874",
          impurity: "0.9182958340544896",
          samples: "17",
        },
      ],
      name: "Number of Sides",
      value: 3.5,
      color: "#e99f46",
      impurity: "0.9621461334087001",
      samples: "32",
    },
  ],
  name: "Text or Symbol",
  value: 0.5,
  color: "#ce3874",
  impurity: "0.9998900524545518",
  samples: "49",
};
export const RFTree0 = {
  id: "0",
  children: [
    {
      id: "1",
      children: [
        {
          id: "3",
          impurity: "0.0",
          samples: "12",
          value: "[24.  0.]",
          class: "0",
        },
        {
          id: "4",
          children: [
            {
              id: "9",
              impurity: "0.0",
              samples: "2",
              value: "[0. 2.]",
              class: "1",
            },
            {
              id: "10",
              impurity: "1.0",
              samples: "2",
              value: "[1. 1.]",
              class: "0",
            },
          ],
          name: "Text or Symbol",
          value: 0.5,
          color: "#ce3874",
          impurity: "0.8112781244591328",
          samples: "4",
        },
      ],
      name: "Number of Colors",
      value: 2.5,
      color: "#005da3",
      impurity: "0.49123734182433315",
      samples: "16",
    },
    {
      id: "2",
      children: [
        {
          id: "5",
          children: [
            {
              id: "7",
              impurity: "0.7045767128725937",
              samples: "28",
              value: "[ 9. 38.]",
              class: "1",
            },
            {
              id: "8",
              impurity: "0.0",
              samples: "1",
              value: "[2. 0.]",
              class: "0",
            },
          ],
          name: "Number of Sides",
          value: 6.5,
          color: "#e99f46",
          impurity: "0.7682814090975242",
          samples: "29",
        },
        {
          id: "6",
          impurity: "0.0",
          samples: "2",
          value: "[4. 0.]",
          class: "0",
        },
      ],
      name: "Number of Colors",
      value: 3.0,
      color: "#005da3",
      impurity: "0.8595316914502932",
      samples: "31",
    },
  ],
  name: "Number of Sides",
  value: 3.5,
  color: "#e99f46",
  impurity: "0.9998900524545518",
  samples: "47",
};

//The Tree below don't got to the RF scolly section but useful for barcode chart and cantor chart
export const RFTree1 = {
  id: "0",
  children: [
    {
      id: "1",
      children: [
        {
          id: "3",
          children: [
            {
              id: "5",
              children: [
                {
                  id: "7",
                  impurity: "0.0",
                  samples: "2",
                  value: "[0. 3.]",
                  class: "1",
                },
                {
                  id: "8",
                  impurity: "0.4854607607459134",
                  samples: "11",
                  value: "[17.  2.]",
                  class: "0",
                },
              ],
              name: "Text or Symbol",
              color: "#ce3874",
              value: 0.5,
              impurity: "0.7732266742876346",
              samples: "13",
            },
            {
              id: "6",
              children: [
                {
                  id: "9",
                  impurity: "0.6665783579949205",
                  samples: "18",
                  value: "[ 4. 19.]",
                  class: "1",
                },
                {
                  id: "10",
                  impurity: "0.0",
                  samples: "1",
                  value: "[2. 0.]",
                  class: "0",
                },
              ],
              name: "Perimeter",
              color: "#feeca9",
              value: 108.5852,
              impurity: "0.7950402793845223",
              samples: "19",
            },
          ],
          name: "Number of Sides",
          color: "#e99f46",
          value: 3.5,
          impurity: "0.9996734260048917",
          samples: "32",
        },
        {
          id: "4",
          impurity: "0.0",
          samples: "3",
          value: "[0. 4.]",
          class: "1",
        },
      ],
      name: "Perimeter",
      color: "#feeca9",
      value: 110.0494,
      impurity: "0.9930554830121974",
      samples: "35",
    },
    {
      id: "2",
      impurity: "0.6500224216483541",
      samples: "18",
      value: "[25.  5.]",
      class: "0",
    },
  ],
  name: "Perimeter",
  color: "#feeca9",
  value: 113.4955,
  impurity: "0.975119064940866",
  samples: "53",
};
export const RFTree2 = {
  id: "0",
  children: [
    {
      id: "1",
      children: [
        {
          id: "3",
          children: [
            {
              id: "7",
              impurity: "0.0",
              samples: "12",
              value: "[ 0. 18.]",
              class: "1",
            },
            {
              id: "8",
              impurity: "0.0",
              samples: "1",
              value: "[2. 0.]",
              class: "0",
            },
          ],
          name: "Number of Colors",
          color: "#005da3",
          value: 3.5,
          impurity: "0.4689955935892812",
          samples: "13",
        },
        {
          id: "4",
          children: [
            {
              id: "5",
              impurity: "0.0",
              samples: "7",
              value: "[9. 0.]",
              class: "0",
            },
            {
              id: "6",
              impurity: "0.0",
              samples: "2",
              value: "[0. 4.]",
              class: "1",
            },
          ],
          name: "Number of Sides",
          color: "#e99f46",
          value: 4.5,
          impurity: "0.8904916402194913",
          samples: "9",
        },
      ],
      name: "Perimeter",
      color: "#feeca9",
      value: 97.0509,
      impurity: "0.9182958340544896",
      samples: "22",
    },
    {
      id: "2",
      children: [
        {
          id: "9",
          impurity: "0.4537163391869448",
          samples: "10",
          value: "[19.  2.]",
          class: "0",
        },
        {
          id: "10",
          impurity: "0.9990102708804813",
          samples: "18",
          value: "[13. 14.]",
          class: "1",
        },
      ],
      name: "Perimeter",
      color: "#feeca9",
      value: 102.0315,
      impurity: "0.9182958340544896",
      samples: "28",
    },
  ],
  name: "Text or Symbol",
  color: "#ce3874",
  value: 0.5,
  impurity: "0.997249632970471",
  samples: "50",
};
export const RFTree3 = {
  id: "0",
  children: [
    {
      id: "1",
      children: [
        {
          id: "3",
          impurity: "0.24229218908241482",
          samples: "14",
          value: "[ 1. 24.]",
          class: "1",
        },
        {
          id: "4",
          impurity: "0.5032583347756457",
          samples: "6",
          value: "[8. 1.]",
          class: "0",
        },
      ],
      name: "Text or Symbol",
      color: "#ce3874",
      value: 1.0,
      impurity: "0.833764907210665",
      samples: "20",
    },
    {
      id: "2",
      children: [
        {
          id: "5",
          children: [
            {
              id: "7",
              impurity: "0.0",
              samples: "1",
              value: "[0. 2.]",
              class: "1",
            },
            {
              id: "8",
              impurity: "0.2761954276479391",
              samples: "13",
              value: "[20.  1.]",
              class: "0",
            },
          ],
          name: "Text or Symbol",
          color: "#ce3874",
          value: 0.5,
          impurity: "0.5586293734521992",
          samples: "14",
        },
        {
          id: "6",
          children: [
            {
              id: "9",
              impurity: "0.9819407868640977",
              samples: "12",
              value: "[ 8. 11.]",
              class: "1",
            },
            {
              id: "10",
              impurity: "0.0",
              samples: "5",
              value: "[5. 0.]",
              class: "0",
            },
          ],
          name: "Perimeter",
          color: "#feeca9",
          value: 142.8242,
          impurity: "0.9949848281859701",
          samples: "17",
        },
      ],
      name: "Number of Sides",
      color: "#e99f46",
      value: 3.5,
      impurity: "0.8786744932173093",
      samples: "31",
    },
  ],
  name: "Perimeter",
  color: "#feeca9",
  value: 93.1485,
  impurity: "0.9990102708804813",
  samples: "51",
};
export const RFTree6 = {
  id: "0",
  children: [
    {
      id: "1",
      children: [
        {
          id: "7",
          impurity: "0.0",
          samples: "2",
          value: "[0. 2.]",
          class: "1",
        },
        {
          id: "8",
          children: [
            {
              id: "9",
              impurity: "0.0",
              samples: "13",
              value: "[19.  0.]",
              class: "0",
            },
            {
              id: "10",
              impurity: "0.6500224216483541",
              samples: "3",
              value: "[1. 5.]",
              class: "1",
            },
          ],
          name: "Number of Colors",
          color: "#005da3",
          value: 2.5,
          impurity: "0.7219280948873623",
          samples: "16",
        },
      ],
      name: "Text or Symbol",
      color: "#ce3874",
      value: 0.5,
      impurity: "0.8256265261578954",
      samples: "18",
    },
    {
      id: "2",
      children: [
        {
          id: "3",
          impurity: "0.5293608652873644",
          samples: "18",
          value: "[ 3. 22.]",
          class: "1",
        },
        {
          id: "4",
          children: [
            {
              id: "5",
              impurity: "0.0",
              samples: "4",
              value: "[9. 0.]",
              class: "0",
            },
            {
              id: "6",
              impurity: "0.8812908992306927",
              samples: "11",
              value: "[ 6. 14.]",
              class: "1",
            },
          ],
          name: "Perimeter",
          color: "#feeca9",
          value: 118.0409,
          impurity: "0.9991421039919088",
          samples: "15",
        },
      ],
      name: "Perimeter",
      color: "#feeca9",
      value: 114.12,
      impurity: "0.9182958340544896",
      samples: "33",
    },
  ],
  name: "Number of Sides",
  color: "#e99f46",
  value: 3.5,
  impurity: "0.997249632970471",
  samples: "51",
};
export const RFTree7 = {
  id: "0",
  children: [
    {
      id: "1",
      children: [
        {
          id: "3",
          impurity: "0.0",
          samples: "3",
          value: "[0. 5.]",
          class: "1",
        },
        {
          id: "4",
          children: [
            {
              id: "9",
              impurity: "0.0",
              samples: "13",
              value: "[23.  0.]",
              class: "0",
            },
            {
              id: "10",
              impurity: "0.9182958340544896",
              samples: "3",
              value: "[2. 1.]",
              class: "0",
            },
          ],
          name: "Number of Colors",
          color: "#005da3",
          value: 2.5,
          impurity: "0.2351933818192415",
          samples: "16",
        },
      ],
      name: "Text or Symbol",
      color: "#ce3874",
      value: 0.5,
      impurity: "0.7088356733321961",
      samples: "19",
    },
    {
      id: "2",
      children: [
        {
          id: "5",
          children: [
            {
              id: "7",
              impurity: "0.8112781244591328",
              samples: "27",
              value: "[10. 30.]",
              class: "1",
            },
            {
              id: "8",
              impurity: "0.0",
              samples: "1",
              value: "[3. 0.]",
              class: "0",
            },
          ],
          name: "Perimeter",
          color: "#feeca9",
          value: 251.0647,
          impurity: "0.8841151220488478",
          samples: "28",
        },
        {
          id: "6",
          impurity: "0.0",
          samples: "5",
          value: "[7. 0.]",
          class: "0",
        },
      ],
      name: "Number of Colors",
      color: "#005da3",
      value: 3.0,
      impurity: "0.9709505944546686",
      samples: "33",
    },
  ],
  name: "Number of Sides",
  color: "#e99f46",
  value: 3.5,
  impurity: "0.9910760598382222",
  samples: "52",
};
export const RFTree8 = {
  id: "0",
  children: [
    {
      id: "1",
      impurity: "0.7990485210442682",
      samples: "23",
      value: "[ 8. 25.]",
      class: "1",
    },
    {
      id: "2",
      children: [
        {
          id: "3",
          children: [
            {
              id: "5",
              children: [
                {
                  id: "7",
                  children: [
                    {
                      id: "9",
                      impurity: "0.8739810481273578",
                      samples: "11",
                      value: "[12.  5.]",
                      class: "0",
                    },
                    {
                      id: "10",
                      impurity: "0.0",
                      samples: "2",
                      value: "[0. 3.]",
                      class: "1",
                    },
                  ],
                  name: "Perimeter",
                  color: "#feeca9",
                  value: 111.4176,
                  impurity: "0.9709505944546686",
                  samples: "13",
                },
                {
                  id: "8",
                  impurity: "0.0",
                  samples: "8",
                  value: "[11.  0.]",
                  class: "0",
                },
              ],
              name: "Perimeter",
              color: "#feeca9",
              value: 113.4955,
              impurity: "0.8238116333123173",
              samples: "21",
            },
            {
              id: "6",
              impurity: "0.6840384356390417",
              samples: "9",
              value: "[2. 9.]",
              class: "1",
            },
          ],
          name: "Perimeter",
          color: "#feeca9",
          value: 118.0409,
          impurity: "0.9736680645496201",
          samples: "30",
        },
        {
          id: "4",
          impurity: "0.0",
          samples: "4",
          value: "[6. 0.]",
          class: "0",
        },
      ],
      name: "Number of Colors",
      color: "#005da3",
      value: 3.5,
      impurity: "0.9377342939868041",
      samples: "34",
    },
  ],
  name: "Perimeter",
  color: "#feeca9",
  value: 97.0509,
  impurity: "0.9990102708804813",
  samples: "57",
};

export const testData = [
  {
    id: 93,
    "Number of Sides": 4,
    "Number of Colors": 2,
    "Text or Symbol": 2,
    Perimeter: 114.0389008,
    scaledP: 11.40389008,
  },
  {
    //Pentagon signs are crossings sign.
    id: 43,
    "Number of Sides": 5,
    "Number of Colors": 4,
    "Text or Symbol": 2,
    Perimeter: 106.2393518,
    scaledP: 10.62393518,
  },
  /*
  {
    id: 43,
    "Number of Sides": 4,
    "Number of Colors": 2,
    "Text or Symbol": 2,
    Perimeter: 136.2393518,
    scaledP: 13.62393518,
  },
  */
  {
    id: 34,
    "Number of Sides": 4,
    "Number of Colors": 2,
    "Text or Symbol": 2,
    Perimeter: 111.7654385,
    scaledP: 11.17654385,
  },
  {
    id: 52,
    "Number of Sides": 5,
    "Number of Colors": 2,
    "Text or Symbol": 0,
    Perimeter: 92.4879177,
    scaledP: 9.24879177,
  },
  {
    id: 110,
    "Number of Sides": 2,
    "Number of Colors": 2,
    "Text or Symbol": 2,
    Perimeter: 109.0744532,
    scaledP: 10.90744532,
  },
  {
    id: 46,
    "Number of Sides": 4,
    "Number of Colors": 2,
    "Text or Symbol": 2,
    Perimeter: 106.574064,
    scaledP: 10.6574064,
  },
  {
    id: 58,
    "Number of Sides": 2,
    "Number of Colors": 2,
    "Text or Symbol": 2,
    Perimeter: 109.964068,
    scaledP: 10.9964068,
  },
  {
    id: 17,
    "Number of Sides": 4,
    "Number of Colors": 2,
    "Text or Symbol": 0,
    Perimeter: 81.94265228,
    scaledP: 8.194265228,
  },
  {
    id: 114,
    "Number of Sides": 3,
    "Number of Colors": 3,
    "Text or Symbol": 1,
    Perimeter: 120.3123482,
    scaledP: 12.03123482,
  },
  {
    id: 101,
    "Number of Sides": 4,
    "Number of Colors": 4,
    "Text or Symbol": 2,
    Perimeter: 138.6682658,
    scaledP: 13.86682658,
  },
  {
    id: 35,
    "Number of Sides": 4,
    "Number of Colors": 2,
    "Text or Symbol": 0,
    Perimeter: 88.67638899,
    scaledP: 8.867638899,
  },
  {
    id: 81,
    "Number of Sides": 2,
    "Number of Colors": 2,
    "Text or Symbol": 2,
    Perimeter: 118.441489,
    scaledP: 11.8441489,
  },
  {
    id: 1,
    "Number of Sides": 2,
    "Number of Colors": 3,
    "Text or Symbol": 0,
    Perimeter: 86.6025911,
    scaledP: 8.66025911,
  },
  {
    id: 13,
    "Number of Sides": 4,
    "Number of Colors": 2,
    "Text or Symbol": 0,
    Perimeter: 81.8143744,
    scaledP: 8.18143744,
  },
  {
    id: 109,
    "Number of Sides": 2,
    "Number of Colors": 2,
    "Text or Symbol": 2,
    Perimeter: 106.3789027,
    scaledP: 10.63789027,
  },
  {
    id: 5,
    "Number of Sides": 2,
    "Number of Colors": 3,
    "Text or Symbol": 0,
    Perimeter: 110.6300336,
    scaledP: 11.06300336,
  },
  {
    id: 107,
    "Number of Sides": 3,
    "Number of Colors": 3,
    "Text or Symbol": 1,
    Perimeter: 118.5883182,
    scaledP: 11.85883182,
  },
  {
    id: 64,
    "Number of Sides": 2,
    "Number of Colors": 2,
    "Text or Symbol": 2,
    Perimeter: 129.9747278,
    scaledP: 12.99747278,
  },
  {
    id: 85,
    "Number of Sides": 4,
    "Number of Colors": 4,
    "Text or Symbol": 0,
    Perimeter: 327.6769842,
    scaledP: 32.76769842,
  },
  {
    id: 36,
    "Number of Sides": 4,
    "Number of Colors": 2,
    "Text or Symbol": 2,
    Perimeter: 111.10537,
    scaledP: 11.110537,
  },
  {
    id: 106,
    "Number of Sides": 3,
    "Number of Colors": 3,
    "Text or Symbol": 1,
    Perimeter: 114.4030535,
    scaledP: 11.44030535,
  },
  {
    id: 26,
    "Number of Sides": 4,
    "Number of Colors": 2,
    "Text or Symbol": 0,
    Perimeter: 86.21376226,
    scaledP: 8.621376226,
  },
  {
    id: 104,
    "Number of Sides": 3,
    "Number of Colors": 3,
    "Text or Symbol": 1,
    Perimeter: 113.5085125,
    scaledP: 11.35085125,
  },
  {
    id: 75,
    "Number of Sides": 8,
    "Number of Colors": 2,
    "Text or Symbol": 1,
    Perimeter: 116.1157507,
    scaledP: 11.61157507,
  },
  {
    id: 10,
    "Number of Sides": 4,
    "Number of Colors": 2,
    "Text or Symbol": 0,
    Perimeter: 99.33968066,
    scaledP: 9.933968066,
  },
  {
    id: 29,
    "Number of Sides": 4,
    "Number of Colors": 2,
    "Text or Symbol": 2,
    Perimeter: 100.401456,
    scaledP: 10.0401456,
  },
  {
    id: 103,
    "Number of Sides": 3,
    "Number of Colors": 3,
    "Text or Symbol": 1,
    Perimeter: 112.4019241,
    scaledP: 11.24019241,
  },
  {
    id: 31,
    "Number of Sides": 4,
    "Number of Colors": 2,
    "Text or Symbol": 2,
    Perimeter: 104.4817029,
    scaledP: 10.44817029,
  },
  {
    id: 113,
    "Number of Sides": 3,
    "Number of Colors": 3,
    "Text or Symbol": 1,
    Perimeter: 109.3455804,
    scaledP: 10.93455804,
  },
];

export const realTrees = [
  RFTree0,
  RFTree1,
  RFTree2,
  RFTree3,
  RFTree4,
  RFTree5,
  RFTree6,
  RFTree7,
  RFTree8,
];
