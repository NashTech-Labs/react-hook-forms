import { handlers as userListHandler } from "./usersList";
import {handlers as viewAllDealsHandler} from "./viewAllDeals";

const allHandlers = [...userListHandler,...viewAllDealsHandler];

export default allHandlers;
