function cleanData(data) {
  return data.replace(/\n/g, "").trim();
}

// A function to map the original data to the expected format
export function mapToRowsStructure(originalData) {
  const mappedRows = originalData?.map((item) => {
    // Assuming the labels in your original data correspond exactly to the names in the rows array
    // You might need to create a mapping object if they don't
    const name = item.label?.replace(":", ""); // Removing the colon and additional label text if present
    const trans = cleanData(item.data.TUC);
    const experian = cleanData(item.data.EXP);
    const equifax = cleanData(item.data.EQF);

    // If the values are numeric or currency, you may wish to further process them
    // For example, converting strings to numbers or formatting currency

    return { name, trans, experian, equifax };
  });

  return mappedRows;
}


export function formatCurrency(number, currencySymbol = "$") {
  return currencySymbol + number?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
}



export const hasID = (user) =>{  
  return user?.documents?.some((doc) => doc.name === "id_card");
}
export const hasProofOfAddress = (user)=>{
  return user?.documents?.some((doc) => doc.name === "proof_of_address");
}