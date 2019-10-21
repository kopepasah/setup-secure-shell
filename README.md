# Setup Secure Shell

Github Action for setting up SSH and configuring `known_hosts`, `id_rsa` and `config` (optional).

## Requirements

This Action requires two input variables: `ssh-private-key` and `ssh-known-hosts`. These can be loaded within a Workflow step like so:

```
- name: Setup SSH
      uses: kopepasah/setup-secure-shell@master
      with:
        ssh-known-hosts: ${{ secrets.SSH_KNOWN_HOSTS }}
        ssh-private-key: ${{ secrets.SSH_PRIVATE_KEY }}
```
