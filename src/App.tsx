import { Card } from './component/ui/card';

function App() {
    let link = 'https://www.youtube.com/watch?v=6t6ZYsLXMWU';
    let link2 = 'https://x.com/realDonaldTrump/status/1921174163848401313';
    let link3 =
        'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2FGirliyapa%2Fvideos%2F9377012982354491%2F&show_text=false&width=380&t=0';
    return (
        <div className="flex items-center justify-center gap-2 h-screen">
            <Card title={'Test Card Youtube'} link={link} type={'youtube'} />
            <Card title={'Test Card Twitter/X'} link={link2} type={'twitter'} />
            <Card title={'Test Card Facebook'} link={link3} type={'facebook'} />
        </div>
    );
}

export default App;
