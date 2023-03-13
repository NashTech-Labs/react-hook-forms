import { handlers as userListHandler } from "./usersList";
import { handlers as viewAllDealsHandler } from "./viewAllDeals";
import { handlers as summaryPreviewHandler } from "./summaryPreview"
import { handlers as getRole } from "./getRole"

const allHandlers = [...userListHandler, ...viewAllDealsHandler, ...summaryPreviewHandler, ...getRole];

export default allHandlers;
