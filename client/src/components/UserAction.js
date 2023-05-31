/**UserAction Component
 * This component renders as a pop-up window whenever admin wants to delete/promote a user
 */

import { actionDeleteUser, actionPromoteUser, getUsers } from "../service/userService";

export default function UserAction({user, setUsers, toggle, action}) {

    async function deleteUser() {
        const data = await actionDeleteUser(user.username);
        console.log(data)
    
        if(data.message) {
          const users = await getUsers();
          setUsers(users);
          alert(`Successfully deleted user: ${user.username}`)
          toggle(false);
        } else {
          alert(`Failed to delete user: ${user.username}`)
        }
    }

    async function promoteUser() {
        const data = await actionPromoteUser(user.username)
        console.log(data)

        if(data.message) {
            const users = await getUsers();
            setUsers(users);
            alert(`Successfully promoted user: ${user.username}`)
            toggle(false);
          } else {
            alert(`Failed to promote user: ${user.username}`)
          }
    }

    return(
        <div className="userAction-container">
            <h2 className="edit-title">Change user settings</h2>
            <p>Are you sure you want to <span className="user-action">{action}</span> user <span className="user-action">{user.username}</span></p>

            <div>
                <button onClick={action === "delete" ? deleteUser : promoteUser} className="userAction-btn">Proceed</button>
                <button onClick={() => toggle(false)} className="userAction-btn">Cancel</button>
            </div>
        </div>
    )
}