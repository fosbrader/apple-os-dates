interface TurnstileResponse {
  success?: boolean;
  action?: string;
  hostname?: string;
  ["error-codes"]?: string[];
}

export async function verifyTurnstile({
  secretKey,
  token,
  expectedHostname,
  expectedAction = "submission",
  fetchImplementation = fetch,
}: {
  secretKey: string;
  token: string;
  expectedHostname: string;
  expectedAction?: string;
  fetchImplementation?: typeof fetch;
}): Promise<boolean> {
  if (!token || token.length > 2048) return false;

  const form = new URLSearchParams({
    secret: secretKey,
    response: token,
  });
  const response = await fetchImplementation(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form,
      cache: "no-store",
      signal: AbortSignal.timeout(6_000),
    },
  );
  if (!response.ok) return false;

  const result = (await response.json()) as TurnstileResponse;
  return (
    result.success === true &&
    result.action === expectedAction &&
    result.hostname === expectedHostname
  );
}
