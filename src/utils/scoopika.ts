import { Scoopika, Agent, Endpoint } from "@scoopika/scoopika";

import { Tool } from "@scoopika/types";
import { z } from "zod";

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

    // you can add tools to your agent here ;)
    // agent.addTool(...);

    return [agent];
  },
});
