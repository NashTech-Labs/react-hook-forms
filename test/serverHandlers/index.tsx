import { handlers as userListHandler } from "./usersList";
import { handlers as viewAllDealsHandler } from "./viewAllDeals";
import { handlers as summaryPreviewHandler } from "./summaryPreview"
import { handlers as getRole } from "./getRole"
import { handlers as editDeal } from "./editDeal";
import { handlers as disablePromotion } from "./disablePromotion";

const allHandlers = [...userListHandler, ...viewAllDealsHandler, ...summaryPreviewHandler, ...getRole, ...editDeal,...disablePromotion];

export default allHandlers;
