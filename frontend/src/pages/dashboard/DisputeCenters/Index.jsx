import { Box, Stack, Divider, Checkbox } from "@mui/material";

import { useEffect, useState } from "react";
import Text from "../../../components/Text";
import SearchInput from "../../../components/Search";
import { Add, FilterList } from "@mui/icons-material";
import Button from "../../../components/Button";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { mapToRowsStructure } from "../../../utils/helper";


export default function DisputeCenters() {
  const [type, setType] = useState("disputing");

   
  return (
    <Box>
      <Helmet>
        <title>Dispute Center</title>
      </Helmet>

      <Stack spacing={3} sx={{ overflow: "hidden" }}>
        <Stack direction="row" sx={{ width: { sm: "314px", xs: "100%" } }}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            onClick={() => {
              setType("disputing");
            }}
            sx={{
              width: { sm: "157px", xs: "100%" },
              height: "51px",
              borderTopLeftRadius: "10px",
              borderBottomLeftRadius: "10px",
              cursor: "pointer",
              border:
                type === "disputing"
                  ? "1px solid #FF9D43"
                  : "1px solid #CDCDCD",
            }}
          >
            <Text
              fs="18px"
              fw="550"
              color={type === "disputing" ? "#FF9D43" : "#CDCDCD"}
            >
              Disputing
            </Text>
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            onClick={() => {
              setType("attacks");
            }}
            sx={{
              width: { sm: "157px", xs: "100%" },
              height: "51px",
              borderTopRightRadius: "10px",
              borderBottomRightRadius: "10px",
              cursor: "pointer",
              border:
                type === "attacks" ? "1px solid #FF9D43" : "1px solid #CDCDCD",
            }}
          >
            <Text
              fs="18px"
              fw="550"
              color={type === "attacks" ? "#FF9D43" : "#CDCDCD"}
            >
              Attacks
            </Text>
          </Box>
        </Stack>
        {type === "disputing" && (
          <>
            <Text fs="24px" fw="550" color="#131C30">
              Disputes
            </Text>

            <Stack direction="row" spacing={2} justifyContent="space-between">
              <SearchInput
                width="320px"
                height="50px"
                placeholder="Search"
                bgcolor="#fff"
              />

              <Stack
                direction="row"
                spacing={2}
                sx={{ px: 3, backgroundColor: "#fff" }}
                justifyContent="center"
                alignItems="center"
              >
                <FilterList />
                <Text fs="14px" fw="550" color="#475467" sx={{ mb: 0 }}>
                  Filters
                </Text>
              </Stack>
            </Stack>
          </>
        )}

        {type === "disputing" && <Disputes />}
        {type === "attacks" && <Attacks />}
      </Stack>
    </Box>
  );
}

function Disputes() {

const user = useSelector((state) => state.user.details);
const [pInfo, setPInfo] = useState([]);

  useEffect(() => {
    if (user && user.creditReport && user.creditReport.creditReportData) {
      const publicInformation =
        user.creditReport.creditReportData["public_information"];

        console.log( user.creditReport.creditReportData["public_information"]);


      setPInfo(publicInformation);

      console.log(publicInformation);

      if (publicInformation) {
        // Flatten the infoDetails and create an initial checked state array.
        const allInfoDetails = publicInformation
          .map((info) => info.infoDetails)
          .flat();
        setCheckedItems(new Array(allInfoDetails.length).fill(false));
      }
      
    } else {
      console.log("Public  information not found");
    }
  }, [user]);

  const items = [
    { title: "U.S Bankruptcy Court" },
    { title: "U.S Bankruptcy Court" },
    { title: "U.S Bankruptcy Court" },
    { title: "U.S Bankruptcy Court" },
    { title: "U.S Bankruptcy Court" },
    { title: "U.S Bankruptcy Court" },
    { title: "U.S Bankruptcy Court" },
  ];

  const [checkedItems, setCheckedItems] = useState(
    new Array(items.length).fill(false)
  );

  const handleCheckboxChange = (infoIndex, detailIndex) => {
    const startIndex = pInfo
      .slice(0, infoIndex)
      .reduce((total, current) => total + current.infoDetails.length, 0);
    const absoluteIndex = startIndex + detailIndex;

    // Update the state based on the absoluteIndex
    setCheckedItems(
      checkedItems.map((item, index) =>
        index === absoluteIndex ? !item : item
      )
    );
  };
  return (
    <Box>
      <Stack
        direction="row"
        spacing={{ sm: 4, xs: 1 }}
        sx={{ overflow: "hidden", overflowX: "auto" }}
      >
        {pInfo.map((info, infoIndex) =>
           (
              <Box
                key={`${infoIndex}`}
                height="451px"
                minWidth={{ sm: "313px", xs: "300px" }}
                borderRadius="10px"
                border="1px solid #FF9D43"
                sx={{ boxShadow: "0px 4px 20px 0px #0000001A" }}
              >
                <Stack spacing={2}>
                  <Stack spacing={2} sx={{ px: 2.5, pt: 2.5 }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Text fs="20px" fw="550" color="#131C30">
                        {info.EQF}
                      </Text>
                      <Checkbox
                        checked={
                          checkedItems[
                            pInfo
                              .slice(0, infoIndex)
                              .reduce(
                                (total, current) =>
                                  total + current.infoDetails.length,
                                0
                              ) 
                          ]
                        }
                        onChange={() =>
                          handleCheckboxChange(infoIndex)
                        }
                        sx={{
                          color: "#FF9D43",
                          "&.Mui-checked": {
                            color: "#FF9D43",
                          },
                        }}
                      />
                    </Stack>

                    <Button
                      startIcon={<Add />}
                      variant="outlined"
                      sx={{ px: 3 }}
                      width="220px"
                      color="#333333"
                      height="40px"
                    >
                      Add a custom message
                    </Button>
                  </Stack>

                  <Divider sx={{ mt: 0 }} />

                  <Stack spacing={1.5} sx={{ px: 2.5 }}>
                    {[
                      {
                        type: "Chapter 13 bankruptsy",
                        status: "Dismised",
                        reference: "21111531",
                        amount: "$0.00",
                        reported: "04/19/2024",
                        closingDate: "04/19/2024",
                        liability: "$0.00",
                        exemptAmount: "$0.00",
                      },
                    ].map((_item) => (
                      <>
                        <Stack direction="row" spacing={1.5}>
                          <Text fs="14px" fw="550" color="#475467">
                            Type:
                          </Text>
                          <Text fs="14px" fw="400" color="#475467">
                            {_item.type}
                          </Text>
                        </Stack>
                        <Stack direction="row" spacing={1.5}>
                          <Text fs="14px" fw="550" color="#475467">
                            Status:
                          </Text>
                          <Text fs="14px" fw="400" color="#475467">
                            {_item.status}
                          </Text>
                        </Stack>
                        <Stack direction="row" spacing={1.5}>
                          <Text fs="14px" fw="550" color="#475467">
                            Reference#:
                          </Text>
                          <Text fs="14px" fw="400" color="#475467">
                            {_item.reference}
                          </Text>
                        </Stack>
                        <Stack direction="row" spacing={1.5}>
                          <Text fs="14px" fw="550" color="#475467">
                            Asset Amount:
                          </Text>
                          <Text fs="14px" fw="400" color="#475467">
                            {_item.amount}
                          </Text>
                        </Stack>
                        <Stack direction="row" spacing={1.5}>
                          <Text fs="14px" fw="550" color="#475467">
                            Date Files/Reported:
                          </Text>
                          <Text fs="14px" fw="400" color="#475467">
                            {_item.reported}
                          </Text>
                        </Stack>
                        <Stack direction="row" spacing={1.5}>
                          <Text fs="14px" fw="550" color="#475467">
                            Closing Date:
                          </Text>
                          <Text fs="14px" fw="400" color="#475467">
                            {_item.closingDate}
                          </Text>
                        </Stack>
                        <Stack direction="row" spacing={1.5}>
                          <Text fs="14px" fw="550" color="#475467">
                            liability:
                          </Text>
                          <Text fs="14px" fw="400" color="#475467">
                            {_item.liability}
                          </Text>
                        </Stack>
                        <Stack direction="row" spacing={1.5}>
                          <Text fs="14px" fw="550" color="#475467">
                            type:
                          </Text>
                          <Text fs="14px" fw="400" color="#475467">
                            {_item.type}
                          </Text>
                        </Stack>
                        <Stack direction="row" spacing={1.5}>
                          <Text fs="14px" fw="550" color="#475467">
                            Exempt Amount:
                          </Text>
                          <Text fs="14px" fw="400" color="#475467">
                            {_item.exemptAmount}
                          </Text>
                        </Stack>
                      </>
                    ))}
                  </Stack>
                </Stack>
              </Box>
            )
        )}
      </Stack>
      <Box sx={{ mt: 3 }}>
        <Button variant="contained">Attack now</Button>
      </Box>
    </Box>
  );
}

function Attacks() {
  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <Button variant="contained">Start new dispute</Button>
    </Box>
  );
}
