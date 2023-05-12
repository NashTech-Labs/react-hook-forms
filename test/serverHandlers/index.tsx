import { handlers as userListHandler } from "./usersList";
import { handlers as viewAllDealsHandler } from "./viewAllDeals";
import { handlers as summaryPreviewHandler } from "./summaryPreview"
import { handlers as getRole } from "./getRole"
import { handlers as editDeal } from "./editDeal";

const allHandlers = [...userListHandler, ...viewAllDealsHandler, ...summaryPreviewHandler, ...getRole, ...editDeal];

export default allHandlers;
