<?php

use Yonna\I18n\Config as I18nConf;
use Yonna\Log\Config as LogConf;

use Yonna\QuickStart\Install as QuickStartInstall;
use App\Scope\Normal as NormalInstall;

// i18n
I18nConf::setDatabase('default');
I18nConf::setAuto('redis');

// log
LogConf::setFilePathRoot(realpath(__DIR__ . '/../../'));
LogConf::setFileExpireDay(30); // 30 days
LogConf::setDatabase('default');

/**
 * 装载quickStart
 */
QuickStartInstall::log();
QuickStartInstall::i18n();
QuickStartInstall::xoss();
QuickStartInstall::essay();
QuickStartInstall::sdk();
QuickStartInstall::user();
QuickStartInstall::userMetaCategory();
QuickStartInstall::data();
QuickStartInstall::license();
QuickStartInstall::league();
QuickStartInstall::leagueMember();
QuickStartInstall::feedback();
NormalInstall::stat();
NormalInstall::me();
NormalInstall::essay();
