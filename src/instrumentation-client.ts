import { initBotId } from "botid/client/core";

initBotId({
  protect: [
    {
      path: "/api/submissions/",
      method: "POST",
      advancedOptions: { checkLevel: "basic" },
    },
  ],
});
