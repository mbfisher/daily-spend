import { DateTime } from "luxon";

const RFC3339_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";

export const fromRFC3339 = (dt: string) =>
  DateTime.fromFormat(dt, RFC3339_FORMAT);
export const toRFC3339 = (dt: DateTime) => dt.toFormat(RFC3339_FORMAT);
