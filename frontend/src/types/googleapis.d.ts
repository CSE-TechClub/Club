declare module "googleapis" {
  export const google: {
    auth: {
      OAuth2: new (
        clientId: string,
        clientSecret: string,
        redirectUri: string
      ) => {
        setCredentials: (credentials: { access_token: string }) => void;
      };
    };
    calendar: (options: { version: string; auth: any }) => {
      events: {
        list: (params: {
          calendarId: string;
          timeMin: string;
          timeMax: string;
          singleEvents: boolean;
          orderBy: string;
        }) => Promise<{
          data: {
            items: Array<{
              id: string;
              summary: string;
              start: { dateTime: string };
              end: { dateTime: string };
              colorId?: string;
            }>;
          };
        }>;
      };
    };
  };
}
