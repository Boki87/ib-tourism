import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { useVenueData } from "./";
import LinkButton from "../LinkButton";
import { useUser } from "@supabase/auth-helpers-react";

export default function VenueLinks() {
  const { links } = useVenueData();
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
      console.log("collect data to stats");
      fetch(`/api/collect-link-click`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ id: link.id, venueId: link.venue_id }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.error) {
            //customer already gave a review
          } else {
            //customer gave a review
          }
        });
    }

    //then go to the url
    setTimeout(function () {
      window.open(url, "_blank");
    }, 500);
  }

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
              console.log(data);
            });
        }
      } else if (visibility === "visible") {
        setGoingToReview(false);
      }
    };
  }, [goingToReview]);

  return (
    <Box
      display="flex"
      maxW={{ base: "sm", lg: "md" }}
      flexWrap="wrap"
      my="40px"
      mx="auto"
      justifyContent="center"
    >
      {links.map((link) => {
        if (link.is_active) {
          return (
            <LinkButton
              onClick={gotoUrl}
              id={link.id}
              type={link.type}
              isActive={!!link?.is_active}
              key={link.id}
              buttonSize={120}
              m="8px"
            />
          );
        }
      })}
    </Box>
  );
}