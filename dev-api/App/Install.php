<?php

namespace App;

use App\Scope\Me;
use App\Scope\Stat;
use App\Scope\Essay;
use App\Scope\EssayCategory;
use Yonna\QuickStart\Middleware\Limiter;
use Yonna\QuickStart\Middleware\Logging;
use Yonna\Scope\Config;

class Install
{

    public static function me(): void
    {
        Config::middleware([Limiter::class, Logging::class], function () {
            Config::group(['me'], function () {
                Config::post('info', Me::class, 'one');
                Config::post('password', Me::class, 'password');
                Config::post('edit', Me::class, 'update');
                Config::post('leagueCanJoin', Me::class, 'leagueCanJoin');
                Config::post('leagueApply', Me::class, 'leagueApply');
                Config::post('leagueGiveUpApply', Me::class, 'leagueGiveUpApply');
                Config::post('leagueLeave', Me::class, 'leagueLeave');
                Config::post('leagueMemberPass', Me::class, 'leagueMemberPass');
                Config::post('leagueMemberReject', Me::class, 'leagueMemberReject');
                Config::post('leagueMemberDelete', Me::class, 'leagueMemberDelete');
                Config::post('leagueMemberUp', Me::class, 'leagueMemberUp');
                Config::post('leagueMemberDown', Me::class, 'leagueMemberDown');
                Config::post('taskInfo', Me::class, 'taskInfo');
                Config::post('taskCanAssign', Me::class, 'taskCanAssign');
                Config::post('taskCanJoin', Me::class, 'taskCanJoin');
                Config::post('taskAssign', Me::class, 'taskAssign');
                Config::post('taskUnAssign', Me::class, 'taskUnAssign');
                Config::post('taskJoin', Me::class, 'taskJoin');
                Config::post('taskUnJoin', Me::class, 'taskUnJoin');
                Config::post('taskPublishList', Me::class, 'taskPublishList');
                Config::post('taskJoinList', Me::class, 'taskJoinList');
                Config::post('taskEventPhoto', Me::class, 'taskEventPhoto');
            });
        });
    }

    public static function stat(): void
    {
        Config::middleware([Limiter::class],
            function () {
                Config::group(['stat'], function () {
                    Config::post('user', Stat::class, 'user');
                    Config::post('userAccount', Stat::class, 'account');
                    Config::post('league', Stat::class, 'league');
                    Config::post('leagueMember', Stat::class, 'leagueMember');
                    Config::post('task', Stat::class, 'task');
                    Config::post('leagueData', Stat::class, 'leagueData');
                    Config::post('essay', Stat::class, 'essay');
                    Config::post('essayCategory', Stat::class, 'essayCategory');
                    Config::post('userGrow', Stat::class, 'userGrow');
                    Config::post('leagueGrow', Stat::class, 'leagueGrow');
                    Config::post('taskGrow', Stat::class, 'taskGrow');
                    Config::post('essayGrow', Stat::class, 'essayGrow');
                });
            }
        );
    }

    public static function essay(): void
    {
        Config::middleware([Limiter::class],
            function () {
                Config::group(['normal', 'essay'], function () {

                    Config::post('page', Essay::class, 'page');
                    Config::post('views', Essay::class, 'views');
                    Config::post('likes', Essay::class, 'likes');

                    Config::group(['category'], function () {
                        Config::post('list', EssayCategory::class, 'multi');
                    });

                });
            }
        );
    }
}