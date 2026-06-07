import type * as API from "@/app/lib/generated/types";
type User = API.components["schemas"]["User"];

interface UsersProps{
    users: User[]
}

export default async function Users({users} :{users: UsersProps}) {

return

}