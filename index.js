/**
 * Setup Secure Shell (SSH)
 *
 * @package SetupSSH
 */

// Node Dependencies
const fs   = require( 'fs' );
const path = require( 'path' );

// External Dependencies
const core = require( '@actions/core' );
const exec = require( '@actions/exec' );
const io   = require( '@actions/io' );

async function run() {
	try {
		const SSH_AUTH_SOCK = '/tmp/ssh-auth.sock';
		const SSH_DIR       = path.join( process.env['HOME'], '.ssh' );
		const CONFIG        = core.getInput( 'ssh-config' );
		const KNOWN_HOSTS   = core.getInput( 'ssh-known-hosts' );
		const PRIVATE_KEY   = core.getInput( 'ssh-private-key' );

		// Set the default write options for files.
		const WRITE_OPTIONS = {
			mode: 0o600,
		};

		// First, ensure the ~/.ssh exists.
		await io.mkdirP( SSH_DIR );

		// If the user has passed a configuration file, add it.
		if ( CONFIG ) {
			await fs.writeFileSync( path.join( SSH_DIR, 'config' ), CONFIG, WRITE_OPTIONS );
		}

		fs.writeFileSync( path.join( SSH_DIR, 'known_hosts' ), KNOWN_HOSTS, WRITE_OPTIONS );
		fs.writeFileSync( path.join( SSH_DIR, 'id_rsa' ), PRIVATE_KEY, WRITE_OPTIONS );

		await exec.exec( 'ssh-agent', [ '-a', SSH_AUTH_SOCK ] );
		await core.exportVariable( 'SSH_AUTH_SOCK', SSH_AUTH_SOCK );
		await exec.exec( `ssh-add ${ path.join( SSH_DIR, 'id_rsa' ) }` );
	} catch ( error ) {
		core.setFailed( error.message );
	}
}

run()
