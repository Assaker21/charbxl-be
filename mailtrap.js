export async function checkMailtrapLimit() {
  try {
    const response = await fetch(
      `https://mailtrap.io/api/accounts/1947590/billing/usage`,
      {
        method: "GET",
        headers: {
          "Api-Token": process.env.MAILTRAP_TOKEN,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorBody)}`);
    }

    const data = await response.json();

    console.log(data.testing.usage.sent_messages_count);
    console.log(data.sending.usage.sent_messages_count);

    return `Testing: ${data.testing.usage.sent_messages_count.current}/${data.testing.usage.sent_messages_count.limit}
    <br/>
Sending: ${data.sending.usage.sent_messages_count.current}/${data.sending.usage.sent_messages_count.limit}`;
  } catch (error) {
    console.error("Error fetching Mailtrap stats:", error.message);
  }
}
