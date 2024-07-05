import { Scoopika, Agent, Endpoint } from "@scoopika/scoopika";

import { Tool } from "@scoopika/types";
import { NextResponse } from "next/server";
import { z } from "zod";
import fs from "fs";
import FormData from "form-data";
import { Readable } from "stream";
import axios from "axios";

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
          .string()
          .describe("what are the bill urls provided for the bill")
          .optional(),
      }),

      execute: async ({ remarks, bills }) => {
        console.log("remarks -- ", remarks, " , bills -- ", bills);
        // let formData = new FormData();
        // formData.append("remarks", remarks);
        // formData.append("bills", fs.createReadStream("md.png"));
        // formData.append("scope", "PERSONAL");
        // formData.append("raiseClaim", "false");
        // formData.append(
        //   "existingBills",
        //   "https://ncaish-detax-bills-uat.s3.ap-south-1.amazonaws.com/16c19dd4-8a85-4112-ae74-d394dffc0f6e-transaction0.png"
        // );

        // let config = {
        //   method: "post",
        //   maxBodyLength: Infinity,
        //   url: "https://api.ncash.money/rn/mapi/v1/secure/detax/card/transactions/484ad711-8284-47ab-adf5-d634071a4600/edit-upload/bill",
        //   headers: {
        //     Authorization:
        //       "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6Ijk1NzQxZjUyLTdkMzctNDE3Ni05NDdhLTNkZWYzYzM0Mzk2YyIsImNsaWVudF9pZCI6ImVtcGxveWVlX2FwcF9jbGllbnRfaWQiLCJjaWQiOiJjYjQ1ZGNmNS04OTE5LTQ2ZGMtOGVkMi0yZjU4YjM4MDc4OGMiLCJlbWFpbCI6ImVrYW5hdGhhbmtzQG5jYXNoLmFpIiwiaW5pdFBhc3NDaGFuZ2VkIjp0cnVlLCJmdWxsX25hbWUiOiJFa2FuYXRoYW4gSyBTICIsInN3aXRjaEFjY291bnQiOmZhbHNlLCJhdXRob3JpdGllcyI6WyJST0xFX0NPUlBPUkFURV9FTVBMT1lFRSJdLCJyb2xlcyI6WyJST0xFX0NPUlBPUkFURV9FTVBMT1lFRSJdLCJpYXQiOjE3MjAxNjAzNjgsImV4cCI6MTcyMDIwMzU2OH0.1PF6TVnGYrTC1HFmKm5Q5GWX8anEkwtrvKH72GpD5-c",
        //     ...formData.getHeaders(),
        //   },
        //   data: formData,
        // };

        // axios
        //   .request(config)
        //   .then((response) => {
        //     console.log(JSON.stringify(response.data));
        //     return JSON.stringify(response.data);
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //   });

        let data = new FormData();
        data.append("remarks", remarks ?? "");

        // Append the file to FormData
        data.append("bills", fs.createReadStream("md.png"));

        // data.append("bills", {
        //   uri: "C:\\Users\\Dell\\nextjs-starter-1\\md.png",
        //   type: "image/png",
        //   name: "txns.png",
        // } as any);
        // data.append(
        //   "bills",
        //   fs.createReadStream(
        //     "md.png"
        //     //"https://ncaish-detax-bills-uat.s3.ap-south-1.amazonaws.com/16c19dd4-8a85-4112-ae74-d394dffc0f6e-transaction0.png"
        //   )
        // );
        data.append("scope", "PERSONAL");
        data.append("raiseClaim", "false");
        data.append(
          "existingBills",
          "https://ncaish-detax-bills-uat.s3.ap-south-1.amazonaws.com/16c19dd4-8a85-4112-ae74-d394dffc0f6e-transaction0.png"
        );

        const response = await fetch(
          "https://api.ncash.money/rn/mapi/v1/secure/detax/card/transactions/5523a5e9-1051-414a-a210-90f9a4be34f4/edit-upload/bill",
          {
            method: "POST",
            headers: {
              "Content-Type": "multipart/form-data;boundary=abcd",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6Ijk1NzQxZjUyLTdkMzctNDE3Ni05NDdhLTNkZWYzYzM0Mzk2YyIsImNsaWVudF9pZCI6ImVtcGxveWVlX2FwcF9jbGllbnRfaWQiLCJjaWQiOiJjYjQ1ZGNmNS04OTE5LTQ2ZGMtOGVkMi0yZjU4YjM4MDc4OGMiLCJlbWFpbCI6ImVrYW5hdGhhbmtzQG5jYXNoLmFpIiwiaW5pdFBhc3NDaGFuZ2VkIjp0cnVlLCJmdWxsX25hbWUiOiJFa2FuYXRoYW4gSyBTICIsInN3aXRjaEFjY291bnQiOmZhbHNlLCJhdXRob3JpdGllcyI6WyJST0xFX0NPUlBPUkFURV9FTVBMT1lFRSJdLCJyb2xlcyI6WyJST0xFX0NPUlBPUkFURV9FTVBMT1lFRSJdLCJpYXQiOjE3MjAxNjAzNjgsImV4cCI6MTcyMDIwMzU2OH0.1PF6TVnGYrTC1HFmKm5Q5GWX8anEkwtrvKH72GpD5-c",
            },
            body: data as any,
          }
        );

        const responseData = await response.json();
        console.log("response data -- ", responseData);

        //return responseData.message;
        // let config = {
        //   method: "post",
        //   maxBodyLength: Infinity,
        //   url: "https://api.ncash.money/rn/mapi/v1/secure/detax/card/transactions/5523a5e9-1051-414a-a210-90f9a4be34f4/upload/bill",
        //   headers: {
        //     Authorization:
        //       "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjFjNjQzOTgxLTI2ZDItNDVjOC1hZTY4LTI4OGNjZGU3YjkxNiIsImNsaWVudF9pZCI6ImVtcGxveWVlX2FwcF9jbGllbnRfaWQiLCJjaWQiOiJjYjQ1ZGNmNS04OTE5LTQ2ZGMtOGVkMi0yZjU4YjM4MDc4OGMiLCJlbWFpbCI6ImhhcmlAbmNhc2guYWkiLCJpbml0UGFzc0NoYW5nZWQiOnRydWUsImZ1bGxfbmFtZSI6IkJhbmRhcnUgSGFyaSBCYWJ1ICIsInN3aXRjaEFjY291bnQiOmZhbHNlLCJhdXRob3JpdGllcyI6WyJST0xFX0NPUlBPUkFURV9FTVBMT1lFRSJdLCJyb2xlcyI6WyJST0xFX0NPUlBPUkFURV9FTVBMT1lFRSJdLCJpYXQiOjE3MjAwODc0NzksImV4cCI6MTcyMDEzMDY3OX0.igddEr6QSteMN4mDl0iBqX6hR9xhRlDsWoGZje9Y3C8",
        //     ...data.getHeaders(),
        //   },
        //   data: data,
        // };

        // axios
        //   .request(config)
        //   .then((response: { data: any }) => {
        //     console.log(JSON.stringify(response.data));
        //   })
        //   .catch((error: any) => {
        //     console.log(error);
        //   });

        // const formData = new FormData();
        // formData.append("remarks", "Sample remarks");
        // formData.append(
        //   "bills",
        //   fs.createReadStream("C:\\Users\\Dell\\nextjs-starter-1\\md.png"),
        //   {
        //     filename: "filename.png", // Optional: Specify filename if needed
        //     contentType: "image/png", // Optional: Specify content type if needed
        //   }
        // );
        // formData.append("scope", "PERSONAL");
        // formData.append("raiseClaim", "false");

        // const response = await axios.post(
        //   "https://api.ncash.money/rn/mapi/v1/secure/detax/card/transactions/5523a5e9-1051-414a-a210-90f9a4be34f4/upload/bill",
        //   formData,
        //   {
        //     headers: {
        //       "Content-Type": "multipart/form-data",
        //       Authorization:
        //         "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjFjNjQzOTgxLTI2ZDItNDVjOC1hZTY4LTI4OGNjZGU3YjkxNiIsImNsaWVudF9pZCI6ImVtcGxveWVlX2FwcF9jbGllbnRfaWQiLCJjaWQiOiJjYjQ1ZGNmNS04OTE5LTQ2ZGMtOGVkMi0yZjU4YjM4MDc4OGMiLCJlbWFpbCI6ImhhcmlAbmNhc2guYWkiLCJpbml0UGFzc0NoYW5nZWQiOnRydWUsImZ1bGxfbmFtZSI6IkJhbmRhcnUgSGFyaSBCYWJ1ICIsInN3aXRjaEFjY291bnQiOmZhbHNlLCJhdXRob3JpdGllcyI6WyJST0xFX0NPUlBPUkFURV9FTVBMT1lFRSJdLCJyb2xlcyI6WyJST0xFX0NPUlBPUkFURV9FTVBMT1lFRSJdLCJpYXQiOjE3MjAwODc0NzksImV4cCI6MTcyMDEzMDY3OX0.igddEr6QSteMN4mDl0iBqX6hR9xhRlDsWoGZje9Y3C8",
        //     },
        //     maxBodyLength: Infinity,
        //   }
        // );

        // console.log(response.data);
      }, // the tool logic goes here
    });

    // you can add tools to your agent here ;)
    // agent.addTool(...);

    return [agent];
  },
});
