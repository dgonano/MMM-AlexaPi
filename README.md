# Module: MMM-AlexaPi
The `MMM-AlexaPi` module is used to integrate with <a href="https://github.com/alexa-pi/AlexaPi" target="_blank">AlexaPi</a>
This module indicates the status of AlexaPi. Possible status' include,
- `no_connection`
- `idle`
- `recording`
- `processing` 
- `playback`
- `error`

## Using the module

Clone the repo in the modules folder:
`git clone https://github.com/dgonano/MMM-AlexaPi.git`

Add it to the modules array in the `config/config.js` file:
````javascript
modules: [
    {
        module: 'MMM-AlexaPi',
        position: 'lower_third',
        config: {
            // The config property is optional.
            // If no config is set, defualt values are used
            // See 'Configuration options' for more information.
        }
    }
]
````

**Note:** When installing AlexaPi be sure to set the device to `magicmirror` and not `raspberrypi` (or other device)

## Configuration options

The following properties can be configured:


<table width="100%">
    <!-- why, markdown... -->
    <thead>
        <tr>
            <th>Option</th>
            <th width="100%">Description</th>
        </tr>
    <thead>
    <tbody>
        <tr>
            <td><code>alexaTimeout</code></td>
            <td>The time is milliseconds a status will be displayed before automatically reverting to 'idle'<br>
            <br><b>Default value:</b> <code>30000</code> (30 Seconds)
            </td>
        </tr>
        <tr>
            <td><code>alexaHBTimeout</code></td>
            <td>The time in milliseconds a heartbeat needs to be recieved from AlexaPi before declaring <code>no_connection</code><br>
            <br><b>Default value:</b> <code>10000</code> (10 Seconds)
            </td>
        </tr>
    </tbody>
</table>
