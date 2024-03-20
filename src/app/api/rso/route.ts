import moment from "moment";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const start_date = moment(searchParams.get("start_date"));
  const end_date = moment(searchParams.get("end_date"));

  let combinedData = [];

  // Loop through the dates between start_date and end_date
  for (
    let date = moment(start_date);
    date.isSameOrBefore(end_date);
    date.add(1, "days")
  ) {
    const formattedDate = date.format("YYYY-MM-DD");
    const res: any = await fetch(
      `https://eaokz1.buildship.run/ea?date=${formattedDate}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    combinedData.push(data);

    if (date.isAfter(end_date)) {
      break;
    }
  }

  combinedData = [].concat(...combinedData);
  return Response.json({ data: combinedData });
}
