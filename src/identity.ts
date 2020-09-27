
import axios from 'axios'


interface IdentityDetailsPayload {
  guid?: String,
  email?: String,
  api_token: String
}

interface Contact {
  firstName?: String,
  lastName?: String,
  email: String,
  phone?: String,
  address: Address
}

interface Address {
  country: String,
  postcode: String,
  locality?: String,
  region?: String
}

interface IdentityMemberAddress {
  line1: String,
  line2: String,
  town: String,
  postcode: String,
  country: String
}

interface IdentityMemberDetails {
  guid: String,
  first_name: String,
  middle_names: String,
  last_name: String,
  email: String,
  phone_number: String,
  address: IdentityMemberAddress
  // donations: {
  //   has_donated: false,
  //   donation_count: 0,
  //   last_donated: null,
  //   highest_donation: 0,
  //   average_donation: 0
  // },
  // donation_preference: null,
  // regular_donation: { current_amount: 0, amount_last_changed_at: null },
  // segments: [],
  // actions_taken: {},
  // entry_point: null,
  // mosaic_code: null,
  // mosaic_group: null,
  // created_at: '2020-09-21 19:33:55.704203',
  // optout_at: null,
  // optout_reason: null
  // }
}

interface GUIDOrEmail {
  guid?: String,
  email?: String
}

interface APIConfig {
  token: string,
  url: string
}


async function post<P, T>(payload : P, identityUrl : string) : Promise<T> {
  const url = identityUrl + '/api/member/details'

  const req  = new Request(url, {
    method: "post",
    body: JSON.stringify(payload)
  })
  console.log(req)
  console.log(payload)
  const resp = await fetch(req)
  console.log(`respo: `, resp)
  return resp.json()
}


export async function getMember(by : GUIDOrEmail, api : APIConfig): Promise<string | {}> {
  let api_token = api.token

  let data : IdentityDetailsPayload = null
  if (by.guid) {
    data = {
      api_token: api_token,
      guid: by.guid,
    }
  } else if (by.email) {
    data = {
      api_token: api_token,
      email: by.email
    }
  } else {
    throw new Error("Pass either guild or email to getMember()")
  }

  let ret = post<IdentityDetailsPayload,IdentityMemberDetails>(data, api.url)

  ret = ret.then((x) => {
    return detailsToContact(x)
  }).catch((e) => {
    console.error(`error: ${e}`)
    return null
  })

  return ret
}

function detailsToContact(details : IdentityMemberDetails) : Contact {
  let c : Contact = {
    firstName: details.first_name + (details.middle_names ? ' ' + details.middle_names : ''),
    lastName: details.last_name,
    email: details.email,
    phone: details.phone_number,
    address: {
      country: details.address.country,
      postcode: details.address.postcode
    }
  }

  return c 
}
