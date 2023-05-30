import parseJwt from "./jwtService";
import { loginUser } from "./authService";

test("Check if parseJwt gives us our logged in username", async () => {
    const data = await loginUser({username: "Bob", password: "123"})
    const decoded = parseJwt(data.accessToken)

    console.log(decoded)

    expect(decoded.username).toBe("Bob")
})