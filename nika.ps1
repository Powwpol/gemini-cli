#!/usr/bin/env pwsh
$ScriptDir = Split-Path $MyInvocation.MyCommand.Path
node "$ScriptDir/bundle/gemini.js" @args
