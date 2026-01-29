import { unwrap } from "@/core/lib/input/unwrap";

try {
  const email = unwrap(vEmail(emailRaw));
  const password = unwrap(vPassword(passRaw));

  // use email/password
} catch (e: any) {
  alert(e.message);
}
