/**
 *  AUTO-GENERIERTE   BITTE NICHTS REINSCHREIBEN!
 *  Wurde automatisch generiert aus den Django-Server (http://localhost:8000/api/schema/)
 */
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { fetcher } from "@/app/lib/fetcher";
import type { components } from "@/app/lib/generated/types";

export const api = {
  group: {
    list: () => useSWR<components["schemas"]["Group"][]>("/group/", fetcher),
    get: (id: string | number) =>
      useSWR<components["schemas"]["Group"]>(`/group/${id}/`, fetcher),
    create: () => useSWRMutation<
      components["schemas"]["Group"],
      Error,
      string,
      Partial<components["schemas"]["Group"]> // Autocomplete
    >("/group/", (url, { arg }) =>
      fetcher(url, { method: "POST", body: JSON.stringify(arg) })
    ),
    update: () => useSWRMutation<
      components["schemas"]["Group"],
      Error,
      string,
      Partial<components["schemas"]["Group"]>
    >("/group/", (url, { arg }) =>
      fetcher(`${url}${(arg as any).id}/`, {
        method: "PUT",
        body: JSON.stringify(arg),
      })
    ),
    delete: () => useSWRMutation<
      void,
      Error,
      string,
      string | number
    >("/group/", (url, { arg }) =>
      fetcher(`${url}${arg}/`, { method: "DELETE" })
    ),
  },
  permission: {
    list: () => useSWR<components["schemas"]["Permission"][]>("/permission/", fetcher),
    get: (id: string | number) =>
      useSWR<components["schemas"]["Permission"]>(`/permission/${id}/`, fetcher),
    create: () => useSWRMutation<
      components["schemas"]["Permission"],
      Error,
      string,
      Partial<components["schemas"]["Permission"]> // Autocomplete
    >("/permission/", (url, { arg }) =>
      fetcher(url, { method: "POST", body: JSON.stringify(arg) })
    ),
    update: () => useSWRMutation<
      components["schemas"]["Permission"],
      Error,
      string,
      Partial<components["schemas"]["Permission"]>
    >("/permission/", (url, { arg }) =>
      fetcher(`${url}${(arg as any).id}/`, {
        method: "PUT",
        body: JSON.stringify(arg),
      })
    ),
    delete: () => useSWRMutation<
      void,
      Error,
      string,
      string | number
    >("/permission/", (url, { arg }) =>
      fetcher(`${url}${arg}/`, { method: "DELETE" })
    ),
  },
  profile: {
    list: () => useSWR<components["schemas"]["Profile"][]>("/profile/", fetcher),
    get: (id: string | number) =>
      useSWR<components["schemas"]["Profile"]>(`/profile/${id}/`, fetcher),
    create: () => useSWRMutation<
      components["schemas"]["Profile"],
      Error,
      string,
      Partial<components["schemas"]["Profile"]> // Autocomplete
    >("/profile/", (url, { arg }) =>
      fetcher(url, { method: "POST", body: JSON.stringify(arg) })
    ),
    update: () => useSWRMutation<
      components["schemas"]["Profile"],
      Error,
      string,
      Partial<components["schemas"]["Profile"]>
    >("/profile/", (url, { arg }) =>
      fetcher(`${url}${(arg as any).id}/`, {
        method: "PUT",
        body: JSON.stringify(arg),
      })
    ),
    delete: () => useSWRMutation<
      void,
      Error,
      string,
      string | number
    >("/profile/", (url, { arg }) =>
      fetcher(`${url}${arg}/`, { method: "DELETE" })
    ),
  },
  regformfielddef: {
    list: () => useSWR<components["schemas"]["RegFormFieldDef"][]>("/regformfielddef/", fetcher),
    get: (id: string | number) =>
      useSWR<components["schemas"]["RegFormFieldDef"]>(`/regformfielddef/${id}/`, fetcher),
    create: () => useSWRMutation<
      components["schemas"]["RegFormFieldDef"],
      Error,
      string,
      Partial<components["schemas"]["RegFormFieldDef"]> // Autocomplete
    >("/regformfielddef/", (url, { arg }) =>
      fetcher(url, { method: "POST", body: JSON.stringify(arg) })
    ),
    update: () => useSWRMutation<
      components["schemas"]["RegFormFieldDef"],
      Error,
      string,
      Partial<components["schemas"]["RegFormFieldDef"]>
    >("/regformfielddef/", (url, { arg }) =>
      fetcher(`${url}${(arg as any).id}/`, {
        method: "PUT",
        body: JSON.stringify(arg),
      })
    ),
    delete: () => useSWRMutation<
      void,
      Error,
      string,
      string | number
    >("/regformfielddef/", (url, { arg }) =>
      fetcher(`${url}${arg}/`, { method: "DELETE" })
    ),
  },
  registration: {
    list: () => useSWR<components["schemas"]["Registration"][]>("/registration/", fetcher),
    get: (id: string | number) =>
      useSWR<components["schemas"]["Registration"]>(`/registration/${id}/`, fetcher),
    create: () => useSWRMutation<
      components["schemas"]["Registration"],
      Error,
      string,
      Partial<components["schemas"]["Registration"]> // Autocomplete
    >("/registration/", (url, { arg }) =>
      fetcher(url, { method: "POST", body: JSON.stringify(arg) })
    ),
    update: () => useSWRMutation<
      components["schemas"]["Registration"],
      Error,
      string,
      Partial<components["schemas"]["Registration"]>
    >("/registration/", (url, { arg }) =>
      fetcher(`${url}${(arg as any).id}/`, {
        method: "PUT",
        body: JSON.stringify(arg),
      })
    ),
    delete: () => useSWRMutation<
      void,
      Error,
      string,
      string | number
    >("/registration/", (url, { arg }) =>
      fetcher(`${url}${arg}/`, { method: "DELETE" })
    ),
  },
  tokenobtainpair: {
    list: () => useSWR<components["schemas"]["TokenObtainPair"][]>("/tokenobtainpair/", fetcher),
    get: (id: string | number) =>
      useSWR<components["schemas"]["TokenObtainPair"]>(`/tokenobtainpair/${id}/`, fetcher),
    create: () => useSWRMutation<
      components["schemas"]["TokenObtainPair"],
      Error,
      string,
      Partial<components["schemas"]["TokenObtainPair"]> // Autocomplete
    >("/tokenobtainpair/", (url, { arg }) =>
      fetcher(url, { method: "POST", body: JSON.stringify(arg) })
    ),
    update: () => useSWRMutation<
      components["schemas"]["TokenObtainPair"],
      Error,
      string,
      Partial<components["schemas"]["TokenObtainPair"]>
    >("/tokenobtainpair/", (url, { arg }) =>
      fetcher(`${url}${(arg as any).id}/`, {
        method: "PUT",
        body: JSON.stringify(arg),
      })
    ),
    delete: () => useSWRMutation<
      void,
      Error,
      string,
      string | number
    >("/tokenobtainpair/", (url, { arg }) =>
      fetcher(`${url}${arg}/`, { method: "DELETE" })
    ),
  },
  tokenrefresh: {
    list: () => useSWR<components["schemas"]["TokenRefresh"][]>("/tokenrefresh/", fetcher),
    get: (id: string | number) =>
      useSWR<components["schemas"]["TokenRefresh"]>(`/tokenrefresh/${id}/`, fetcher),
    create: () => useSWRMutation<
      components["schemas"]["TokenRefresh"],
      Error,
      string,
      Partial<components["schemas"]["TokenRefresh"]> // Autocomplete
    >("/tokenrefresh/", (url, { arg }) =>
      fetcher(url, { method: "POST", body: JSON.stringify(arg) })
    ),
    update: () => useSWRMutation<
      components["schemas"]["TokenRefresh"],
      Error,
      string,
      Partial<components["schemas"]["TokenRefresh"]>
    >("/tokenrefresh/", (url, { arg }) =>
      fetcher(`${url}${(arg as any).id}/`, {
        method: "PUT",
        body: JSON.stringify(arg),
      })
    ),
    delete: () => useSWRMutation<
      void,
      Error,
      string,
      string | number
    >("/tokenrefresh/", (url, { arg }) =>
      fetcher(`${url}${arg}/`, { method: "DELETE" })
    ),
  },
  user: {
    list: () => useSWR<components["schemas"]["User"][]>("/users/", fetcher),
    get: (id: string | number) =>
      useSWR<components["schemas"]["User"]>(`/users/${id}/`, fetcher),
    create: () => useSWRMutation<
      components["schemas"]["User"],
      Error,
      string,
      Partial<components["schemas"]["User"]> // Autocomplete
    >("/users/", (url, { arg }) =>
      fetcher(url, { method: "POST", body: JSON.stringify(arg) })
    ),
    update: () => useSWRMutation<
      components["schemas"]["User"],
      Error,
      string,
      Partial<components["schemas"]["User"]>
    >("/users/", (url, { arg }) =>
      fetcher(`${url}${(arg as any).id}/`, {
        method: "PUT",
        body: JSON.stringify(arg),
      })
    ),
    delete: () => useSWRMutation<
      void,
      Error,
      string,
      string | number
    >("/users/", (url, { arg }) =>
      fetcher(`${url}${arg}/`, { method: "DELETE" })
    ),
  },
};
