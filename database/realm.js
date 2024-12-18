import Realm from "realm";
import Tables from "../constents/constents";

const TagSchema = {
  name: Tables.tag,
  properties: {
    id: "string",
    tagName: "string",
    imageCount: { type: "int", default: 0 },
  },
  primaryKey: "id",
};

const ImageSchema = {
  name: Tables.image,
  properties: {
    id: "string",
    tagId: "string",
    imageUri: "string",
  },
  primaryKey: "id",
};

const realm = new Realm({ schema: [TagSchema, ImageSchema] });
export default realm;
