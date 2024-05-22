import { useEffect, useState } from "react";
import { Box, Center, Grid, GridItem, Text } from "@chakra-ui/react";
import { useVenueData } from "./";
import LinkButton from "../LinkButton";
import { useUser } from "@supabase/auth-helpers-react";
import LinkIcon from "../LinkIcon";

export default function VenueLinks() {
  const { links, nfcId } = useVenueData();
  const [goingToReview, setGoingToReview] = useState(false);
  const user = useUser();

  function gotoUrl(id: string) {
    const link = links.filter((link) => link.id === id)[0];
    const url = link.url;
    if (!url || url == "") return;
    if (!user) {
      //Record link click to database here
      //maybe hit a custom api endpoint that handles that

      //only send request if not an admin user / owner previewing the page
      //collect the request here
      setGoingToReview(true);
      console.log("collect data to stats", {
        id: link.id,
        venueId: link.venue_id,
      });
      fetch(`/api/collect-link-click`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ id: link.id, venueId: link.venue_id, nfcId }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("link click", data);
          if (data.error) {
            //customer already gave a review
          } else {
            //customer gave a review
          }
        })
        .catch((error) => console.log(error));
    }

    //then go to the url
    setTimeout(function () {
      window.open(url, "_blank");
    }, 500);
  }

  const activeLinks = links.filter((link) => link.is_active);

  useEffect(() => {
    document.onvisibilitychange = function () {
      let visibility = document.visibilityState;
      if (visibility === "hidden") {
        if (!goingToReview && !user) {
          //set session cookie to block multiple requests to statistics
          console.log("set cookie");
          fetch(`/api/set-session`)
            .then((res) => {
              return res.json();
            })
            .then((data) => {
              // console.log(data);
            });
        }
      } else if (visibility === "visible") {
        setGoingToReview(false);
      }
    };
  }, [goingToReview]);

  if (activeLinks.length === 0) return null;
  return (
    <>
      <Text textAlign="center" mt={3}>
        Follow us on:
      </Text>
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        pb={12}
        w={activeLinks.length < 4 ? `${activeLinks.length}00px` : "100%"}
        mx="auto"
        maxW="md"
      >
        {activeLinks.map((link) => {
          return (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              my={2}
              minWidth={
                activeLinks.length < 4 ? `${100 / activeLinks.length}%` : "25%"
              }
            >
              <LinkIcon
                onClick={gotoUrl}
                id={link.id}
                type={link.type}
                isActive={!!link?.is_active}
                key={link.id}
                title={link.title}
              />
            </Box>
          );
        })}
      </Box>
    </>
  );
}
