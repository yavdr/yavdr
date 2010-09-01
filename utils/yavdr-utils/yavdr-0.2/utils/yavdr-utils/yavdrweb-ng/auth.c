#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <security/pam_appl.h>
#include <sys/types.h>
#include <sys/stat.h>

//#include "common.h"
//#include "misc.h"
#include "auth.h"

typedef struct {
  const char *pam_user;
  const char *pam_pass;
} tAppdata;

static int pam_exchange(int num_msg, const struct pam_message **msg, struct pam_response **resp, void *appdata_ptr)
{
  int i;
  struct pam_response *response = NULL;
  tAppdata *pAppdata = (tAppdata *)appdata_ptr;
  
  if(num_msg <= 0)
    return PAM_CONV_ERR;
  
  response = (struct pam_response *) calloc(num_msg, sizeof(struct pam_response));
  
  if(response == (struct pam_response *)0)
    return PAM_CONV_ERR;
  
  for(i = 0; i < num_msg; i++) {
    response[i].resp_retcode = 0; /* PAM_SUCCESS; */
    
    switch(msg[i]->msg_style) {
    case PAM_PROMPT_ECHO_ON:
      /* PAM frees response and resp.  If you don't believe this, please read
       * the actual PAM RFCs as well as have a good look at libpam.
       */
      response[i].resp = pAppdata->pam_user ? (char *) strdup(pAppdata->pam_user) : NULL;
      break;
      
    case PAM_PROMPT_ECHO_OFF:
      /* PAM frees response and resp.  If you don't believe this, please read
       * the actual PAM RFCs as well as have a good look at libpam.
       */
      response[i].resp = pAppdata->pam_pass ? (char *) strdup(pAppdata->pam_pass) : NULL;
      break;
      
    case PAM_TEXT_INFO:
    case PAM_ERROR_MSG:
      /* Ignore it, but pam still wants a NULL response... */
      response[i].resp = NULL;
      break;
    default:
      /* Must be an error of some sort... */
      if(response[i].resp != NULL)
        free(response[i].resp);
      
      free(response);
      return PAM_CONV_ERR;
    }
  }
  
  *resp = response;
  return PAM_SUCCESS;
}


int authenticate_user(const char *user, const char *pass)
{
  pam_handle_t *pamh;
  tAppdata appdata = {user, pass};
  struct pam_conv pam_conv = {&pam_exchange, &appdata};

  if ((pam_start (PAM_SERVICE_NAME, NULL, &pam_conv, &pamh) != PAM_SUCCESS) ||
      (pam_authenticate (pamh,PAM_SILENT) != PAM_SUCCESS) ||
      (pam_acct_mgmt (pamh,0) != PAM_SUCCESS) ||
      (pam_setcred (pamh,PAM_ESTABLISH_CRED) != PAM_SUCCESS))
  {
    pam_end (pamh,PAM_AUTH_ERR); 
    return 0;
  }	

  pam_end (pamh,PAM_SUCCESS);	
  return 1;	
}

