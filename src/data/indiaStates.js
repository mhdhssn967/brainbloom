// Generated from the SVG label_points group.
// centroid = { x: cx, y: cy } from the SVG label_points circles.
// These are pixel coordinates within the SVG's viewBox.
// id must match the SVG path id exactly.

export const INDIA_STATES = [
  { id: "INJK", name: "Jammu and Kashmir",                    centroid: { x: 274.8, y: 156.1 } },
  { id: "INLA", name: "Ladakh",                               centroid: { x: 344.9, y: 136.5 } },
  { id: "INHP", name: "Himachal Pradesh",                     centroid: { x: 348.4, y: 217.7 } },
  { id: "INPB", name: "Punjab",                               centroid: { x: 300.5, y: 254.4 } },
  { id: "INCH", name: "Chandigarh",                           centroid: { x: 334.9, y: 255.1 } },
  { id: "INHR", name: "Haryana",                              centroid: { x: 323.0, y: 305.2 } },
  { id: "INDL", name: "Delhi",                                centroid: { x: 344.1, y: 320.0 } },
  { id: "INRJ", name: "Rajasthan",                            centroid: { x: 256.7, y: 375.8 } },
  { id: "INUP", name: "Uttar Pradesh",                        centroid: { x: 438.7, y: 375.5 } },
  { id: "INUT", name: "Uttarakhand",                          centroid: { x: 401.4, y: 272.1 } },
  { id: "INBR", name: "Bihar",                                centroid: { x: 575.8, y: 411.0 } },
  { id: "INJH", name: "Jharkhand",                            centroid: { x: 563.9, y: 475.8 } },
  { id: "INWB", name: "West Bengal",                          centroid: { x: 637.1, y: 485.8 } },
  { id: "INAS", name: "Assam",                                centroid: { x: 775.9, y: 393.9 } },
  { id: "INAR", name: "Arunachal Pradesh",                    centroid: { x: 826.3, y: 325.9 } },
  { id: "INNL", name: "Nagaland",                             centroid: { x: 822.1, y: 399.0 } },
  { id: "INMN", name: "Manipur",                              centroid: { x: 801.5, y: 443.1 } },
  { id: "INML", name: "Meghalaya",                            centroid: { x: 737.0, y: 417.6 } },
  { id: "INMZ", name: "Mizoram",                              centroid: { x: 776.2, y: 476.2 } },
  { id: "INTR", name: "Tripura",                              centroid: { x: 740.6, y: 472.2 } },
  { id: "INSK", name: "Sikkim",                               centroid: { x: 654.3, y: 355.6 } },
  { id: "INMP", name: "Madhya Pradesh",                       centroid: { x: 378.4, y: 494.2 } },
  { id: "INGJ", name: "Gujarat",                              centroid: { x: 199.2, y: 481.0 } },
  { id: "INMH", name: "Maharashtra",                          centroid: { x: 305.7, y: 597.9 } },
  { id: "INCT", name: "Chhattisgarh",                         centroid: { x: 473.5, y: 533.4 } },
  { id: "INOR", name: "Odisha",                               centroid: { x: 549.9, y: 559.3 } },
  { id: "INDH", name: "Dadra and Nagar Haveli and Daman & Diu", centroid: { x: 232.5, y: 573.8 } },
  { id: "INGA", name: "Goa",                                  centroid: { x: 261.6, y: 713.9 } },
  { id: "INKA", name: "Karnataka",                            centroid: { x: 302.1, y: 728.1 } },
  { id: "INTF", name: "Telangana",                            centroid: { x: 396.7, y: 641.9 } },
  { id: "INAP", name: "Andhra Pradesh",                       centroid: { x: 392.3, y: 730.7 } },
  { id: "INKL", name: "Kerala",                               centroid: { x: 325.5, y: 848.9 } },
  { id: "INTN", name: "Tamil Nadu",                           centroid: { x: 379.6, y: 835.6 } },
  { id: "INPY", name: "Puducherry",                           centroid: { x: 417.7, y: 838.9 } },
  { id: "INAN", name: "Andaman and Nicobar",                  centroid: { x: 770.3, y: 814.6 } },
  { id: "INLD", name: "Lakshadweep",                          centroid: { x: 233.0, y: 912.6 } },
];

// States used in game rounds — exclude tiny UTs that are hard to click
export const PLAYABLE_STATES = INDIA_STATES.filter(s =>
  !["INCH", "INDL", "INPY", "INLD", "INDH"].includes(s.id)
);