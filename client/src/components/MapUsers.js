/** MapUsers component
 * Mapping through the users recieved as props and return JSX that canbe used to render the table
 */

import parseJwt from "../service/jwtService"

export default function MapUsers({ users, handleUserAction }) {


    if(users !== null) {
        const mappedUsers = users?.map((user, index) => {
          return(
            <tr key={index}>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>{user.purchases ? user.purchases.length : 0}</td>
              <td>
                <button disabled={user.username === parseJwt(sessionStorage.getItem("AuthToken")).username} name="promote" value={index} onClick={handleUserAction}>Promote</button>
                <button disabled={user.username === parseJwt(sessionStorage.getItem("AuthToken")).username} name="delete" value={index} onClick={handleUserAction}>Delete</button>
              </td>
            </tr>
          )
        })

        return(
            mappedUsers
        )
    }
}