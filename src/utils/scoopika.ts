import { Scoopika, Agent, Endpoint } from "@scoopika/scoopika";

import { Tool } from "@scoopika/types";
import { z } from "zod";
const axios = require("axios");
const FormData = require("form-data");

// SERVER ONLY USAGE

export const scoopika = new Scoopika({
  store: process.env.SCOOPIKA_STORE_ID,
  keys: {
    together:
      "224ca0e7ece9a59eaa80240b435ea8583cdf25fec1cd93da9dc20d95af966852",
  }, // enter the API keys of the providers your agent use
});

export const endpoint = new Endpoint({
  scoopika,
  agents: (scoopika) => {
    const agent = new Agent(
      "3989873c-2154-47ea-af3f-1e4303498ba4", // replace with your agent ID
      scoopika
    );

    // agent.addTool({
    //   name: "add_task",
    //   description: "Add user task to be done later",
    //   parameters: z.object({
    //     task: z.string().describe("What is the task to be added"),
    //     deadline: z
    //       .string()
    //       .describe("By when should this task be done")
    //       .optional(),
    //   }),
    //   execute: ({ task, deadline }) => {
    //     console.log("task -- ", task, " , deadline -- ", deadline);
    //   }, // the tool logic goes here
    // });

    agent.addTool({
      name: "upload_bill",
      description: "Add bill to the transaction",
      parameters: z.object({
        remarks: z
          .string()
          .describe("what are the remarks provided for the bill")
          .optional(),
        bills: z
          .array(z.instanceof(File))
          .describe("Array of image files")
          .optional(),
      }),
      execute: ({ remarks, bills }) => {
        console.log("remarks -- ", remarks, " , bills -- ", bills);

        const fs = require("fs");
        let data = new FormData();
        data.append("remarks", remarks);
        data.append(
          "bills",
          fs.createReadStream(
            "https://ncaish-detax-bills-uat.s3.ap-south-1.amazonaws.com/16c19dd4-8a85-4112-ae74-d394dffc0f6e-transaction0.png"
          )
        );
        data.append("scope", "PERSONAL");
        data.append("raiseClaim", "true");

        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "https://api.ncash.money/mapi/v1/secure/detax/card/transactions/34b784cd-b581-4713-84a5-292185bb85f9/upload/bill",
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJ1bWFAbmNhc2guYWkiLCJyb2xlcyI6WyJST0xFX0NPUlBPUkFURV9FTVBMT1lFRSJdLCJhdXRob3JpdGllcyI6WyJST0xFX0NPUlBPUkFURV9FTVBMT1lFRSJdLCJjbGllbnRfaWQiOiJlbXBsb3llZV9hcHBfY2xpZW50X2lkIiwiaW5pdFBhc3NDaGFuZ2VkIjp0cnVlLCJhdWQiOlsicmVzb3VyY2VfaWQiXSwiZnVsbF9uYW1lIjoiVW1hIFNhaGluYSAiLCJwZXJtaXNzaW9ucyI6bnVsbCwic2NvcGUiOlsicm9sZV9hZG1pbiIsInJvbGVfdXNlciJdLCJzd2l0Y2hBY2NvdW50IjpmYWxzZSwiaWQiOiJlOTc3MWE0Ni01ZjYxLTQ2ZWYtOTVhMS1kNDIyNTg5YmFhNmEiLCJleHAiOjE3MDQ5MjU3NzcsImp0aSI6IjEyMWExY2QzLWQyYWUtNGVhYi1iZjRjLWRkY2U4MWQ4N2RmOCIsImVtYWlsIjoidW1hQG5jYXNoLmFpIiwiY2lkIjoiOTMzZTNkYjQtYWVjMC00M2JiLWI4ZDYtOTI0ODYzYjUwZGI3In0.PbFXw9DkROWof2ETASGBBy9t4lFS4TJ6I-7hzVwrfqU",
            ...data.getHeaders(),
          },
          data: data,
        };

        axios
          .request(config)
          .then((response: { data: any }) => {
            console.log(JSON.stringify(response.data));
          })
          .catch((error: any) => {
            console.log(error);
          });
      }, // the tool logic goes here
    });

    // you can add tools to your agent here ;)
    // agent.addTool(...);

    return [agent];
  },
});
