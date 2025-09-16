import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, deleteDoc, writeBatch } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Inspiration {
  id: string;
  content: string;
  source: string;
}

@Injectable({
  providedIn: 'root'
})
export class InspirationsService {
  constructor(private firestore: Firestore) { }

  getInspirations(): Observable<Inspiration[]> {
    const collectionRef = collection(this.firestore, 'inspirations');
    return collectionData(collectionRef, { idField: 'id' }).pipe(
      map((data: any[]) => {
        return data.map(item => ({
          id: item.id,
          content: item.content || '',
          source: item.source || ''
        }));
      })
    );
  }

  // Add inspiration to Firestore
  async addInspiration(inspiration: Omit<Inspiration, 'id'>): Promise<void> {
    console.log('Adding inspiration to Firestore:', inspiration);

    try {
      const collectionRef = collection(this.firestore, 'inspirations');
      await addDoc(collectionRef, {
        content: inspiration.content,
        source: inspiration.source
      });
      console.log('Successfully added inspiration to Firestore');

    } catch (error) {
      console.error('Error adding inspiration to Firestore:', error);
      throw error; // Re-throw so the calling component can handle it
    }
  }

  // Delete inspiration from Firestore
  async deleteInspiration(inspiration: Inspiration): Promise<void> {
    console.log('Deleting inspiration from Firestore:', inspiration);

    try {
      const docRef = doc(this.firestore, 'inspirations', inspiration.id);
      await deleteDoc(docRef);
      console.log('Successfully deleted inspiration from Firestore');

    } catch (error) {
      console.error('Error deleting inspiration from Firestore:', error);
      throw error; // Re-throw so the calling component can handle it
    }
  }

  // Batch import inspirations from constants
  async batchImportInspirations(): Promise<void> {
    const comments = [
      {
        text: `If you can get important things done,\nPeople see you're learning,\nPeople see you learning to do things even when you're unsure how,\nYou share what you learn generously,\nYou don't hide your ignorance nor are you comfortable with it,\nYou respect what others know,\nYou usually know how to find what you don't know,\nYou know how to ask for help,\nYou help others in their own way,\nThen nobody will mind if your success comes from self-learning or prior knowledge,\nNobody will mind your occasional mistakes,\nNobody will mind that you don't know certain things at certain times.`,
        source: "James Bach - Secrets of a Buccaneer-Scholar",
      },
      {
        text: "The culmination of love is grief, and yet we love despite the inevitable. We open our hearts to it. To grieve deeply is to have loved fully. Open your heart to the world as you opened it to me, and you will find every reason to keep living in it.",
        source: "Found in my Line messages",
      },
      {
        text: "We're all going to die, all of us, what a circus! That alone should make us love each other but it doesn't. We are terrorized and flattened by trivialities, we are eaten up by nothing.",
        source: "Charles Bukowski on Instagram",
      },
      {
        text: "Grateful and blessed. Honestly nothing to complain about. If we all put our shit on a table and you could pick anyone's shit, you'd probably pick up your own.",
        source: "kaylaashworth_ on Instagram",
      },
      {
        text: "Before you embark on a journey of revenge, dig two graves.",
        source: "Confucius - philosophyideas on Instagram",
      },
      {
        text: "Surround yourself with relentless humans. People who plan in decades, but live in moments. Train like savages, but create like artists. Obsess in work, relax in life. People who know this is finite, and choose to play infinite games. Find people scaling mountains. Climb together.",
        source: "Zack Pogrob - librarymindset on Instagram",
      },
      {
        text: "Our clutter isn't relegated only to material things.\n\nWe clutter our lives with destructive relationships, careers, obligations, rituals, busyness, minutiae, news, media, politics, gossip, drama, rumors.\n\nWe clutter our attention with glowing screens.\nWe clutter our creativity with distractions.\nWe clutter our free time with trivialities.\nWe clutter our desires with attachments.\n\nOur lives are brimming with existential clutter, emotional clutter, mental clutter, spiritual clutter. So much so that it's hard to distinguish what is clutter—and what is not.",
        source: "theminimalists on Instagram",
      },
      {
        text: "Dad culture is discovering a snack your family loves and overbuying it for weeks until everyone gets sick of it then never eats it again.",
        source: "Amit Verma on Facebook",
      },
      {
        text: "They say a person needs just three things to be truly happy in this world: someone to love, something to do, and something to hope for.",
        source: "Tom Bodett - 林從一 on Facebook",
      },
      {
        text: "人生75%的後悔，都來自自己當時沒做的事情。這是康乃爾大學心理學研究，也是我這幾年面對新事物時的時候抱持的心情，能懷抱改變環境本身就是一種非常難得的勇氣，希望你可以在找到覺悟之後，做出人生中最暢快的決定。",
        source: "PTT - 批踢踢實業坊",
      },
      {
        text: "Stop normalizing the grind and normalize whatever this is",
        source: "philosophy.feed on Instagram",
      },
      {
        text: "Feelings are not to be conquered, but engaged with imagination.",
        source: "theminimalists on Instagram",
      },
      {
        text: "Training is everything. The peach was once a bitter almond; cauliflower is nothing but cabbage with a college education.",
        source: "Mark Twain",
      },
      {
        text: "我一直記得我爸說的一段話。他是一個頑強的混蛋，生命中經歷不少波折，像是曾經失業了一或兩年但都沒告訴我們，我記得有次我很不順——可能是搞砸了某個表演或沒拿到試鏡機會——我很不爽，也可能是覺得很丟臉。\n\n這時我爸說：『亞當，你不可能永遠都快快樂樂，人也不可能都喜歡你，你總有可能會失敗。』我說：『但我只想要快樂啊，我不想要其他那些煩事。』他說：『如果你不經歷煩事，你不會知道什麼是真的快樂。』",
        source: "亞當山德勒訪談 https://www.ptt.cc/bbs/movie/M.1663852086.A.363.html",
      },
      {
        text: "我活到快七十歲，一生中絕對不是一帆風順。二十幾歲時，確實有過將來要成為怎樣的人這類的想法，而且也很據這個想法規劃過人生。但這僅是虛幻而已。一旦走上自己所規劃的路，前途卻是無盡的坎坷。而這些坎坷都是我自己所從未預料過的人生。\n\n一個勵志的人或許會認為面對障礙，盡力排除困難，這樣才是對的，於是繼續往前走。但我很早就發現，與其面對困難與障礙極力突破，或許會日後下來，想想看有沒有其他的路可以讓自己的內體能夠活存下來，這樣才是人生之道。\n\n如今，我即將在肉體上離開這個世間，但是我心靈上覺得非常滿足。這種境界，難道不值得你去追求嗎？",
        source: "李茂生 on Facebook",
      },
      {
        text: "How amazing time is, and how amazing we are. Time has been transformed and we have changed; it has advanced and set us in motion; it has unveiled its face, inspiring us with bewilderment and ecstasy! Yesterday we complained of time and feared it, but today we love and adore it. Indeed, we have begun to perceive its purposes and characteristics, and to comprehend its secrets and enigmas.",
        source: "Khalil Gibran - The Vision: Reflections on the Way of the Soul (1994)",
      },
      {
        text: "The secret of success is an ungovernable curiosity.",
        source: "Larry King - stoicreflections on Instagram",
      },
      {
        text: "Six uncomfortable lessons that we all need to learn:\n\n1. Regret will haunt you more than failure.\n2. You are always responsible for your emotional reactions.\n3. Don't feed your problems with thoughts, starve them with action.\n4. Your life will be defined by your ability to handle uncertainty.\n5. If your goal is to have a healthier mind, start by removing all the junk from your diet.\n6. Your 'best life' won't seek validation, but insecurity will.",
        source: "@steven on Instagram",
      },
      {
        text: "Sometimes, one friend is more than enough to make a day special!!",
        source: "houseof_reddit on Instagram",
      },
      {
        text: "我以為我會更想念她，但老實說，我只是懷念她看我的樣子。",
        source: "香功堂主 on Facebook",
      },
      {
        text: "Only during hard times do people come to understand how difficult it is to be master of their feelings and thoughts.",
        source: "Anton Chekhov - philosophyideas on Instagram",
      },
      {
        text: "FIRST, IT IS AN INTENTION.\n\nTHEN A BEHAVIOR.\n\nTHEN A HABIT.\n\nTHEN A PRACTICE.\n\nTHEN A SECOND NATURE.\n\nTHEN IT IS SIMPLY WHO YOU ARE.",
        source: "spirit_enlightenment on Instagram",
      },
      {
        text: "不知怎麼，偶然就成為弘一大師紀念學會的理事，完全說不得勞苦，但願如大師說的，前世有欠。如果有因果，如果有前生今世，可以說的故事就多了，許多事也能解釋了、明白了、放下了。\n\n1.凡是你想控制的，其實都控制了你，當你什麼都不要的時候，天地都是你的。\n\n2.遇見是因為有債要還了，離開是因為還清了，前世不欠，今生不見；今生相見，定有虧欠。\n\n緣起我在人羣中看見你，緣散我看見你在人羣中。\n\n如若流年有愛就心隨花開，如若人走茶涼就守心自暖。\n\n3.不要害怕失去，你所失去的本來就不屬於你，也不要害怕傷害，能傷害你的都是你的劫數，聽聲三千，看淡即是浮雲。煩惱無數，想開就是晴天。\n\n4.你以為你錯過了是遺憾，其實可能是躲過一劫，別貪心你不可能什麼都擁有，也別灰心，你不可能什麼都沒有。\n\n所願所不願，不如心甘情願。\n所得所不得，不如心安理得。\n\n5.你信不信，有些事上天讓你做不成，那是在保護你。\n\n別抱怨別生氣，世間萬物都是有定數的，記住得到未必是福，失去未必是禍，人生各有渡口，各有各舟，有緣躲不開，無緣碰不到，緣起則聚，緣盡則散。",
        source: "林從一 on Facebook - 弘一法師",
      },
      {
        text: "For believe me! — the secret for harvesting from existence the greatest fruitfulness and the greatest enjoyment is to live dangerously! Build your cities on the slopes of Vesuvius! Send your ships into uncharted seas! Live at war with your peers and yourselves! Be robbers and conquerors as long as you cannot be rulers and possessors, you seekers of knowledge! Soon the age will be past when you could be content to live hidden in forests like shy deer! At long last the search for knowledge will reach out for its due — it will want to rule and possess, and you with it!",
        source: "Friedrich Nietzsche - The Gay Science (1882)",
      },
      {
        text: "On the day when it will be possible for woman to love not in her weakness but in her strength, not to escape herself but to find herself, not to abase herself but to assert herself—on that day love will become for her, as for man, a source of life and not of mortal danger.\n\nFor the time being, love epitomizes in its most moving form the curse that weighs on woman trapped in the feminine universe, the mutilated woman, incapable of being self-sufficient. Innumerable martyrs to love attest to the injustice of a destiny that offers them as ultimate salvation a hell.",
        source: "Simone de Beauvoir - The Second Sex",
      },
      {
        text: "We are terrorized and flattened by trivialities, we are eaten up by nothing.",
        source: "Charles Bukowski - philosophyflirt on Instagram",
      },
      {
        text: "Things you cannot control:\n• the past\n• what others think of you\n• how others behave\n• the outcome of your efforts\n• how other people live their lives\n• every future event\n• the things people say to you\n\nThings you can control:\n• your boundaries\n• the perspectives you have\n• what you give your focus and energy to\n• how you handle challenges\n• your thoughts and actions\n• how you speak to yourself\n• the way you treat others\n• the goals you believe in",
        source: "soulhealingwithamila on Instagram",
      },
      {
        text: "Today at the airport one of the drug dogs set off a false alarm and officers rushed over to find out the dog had alerted them for a piece of pizza. The handler just patted his head and goes \"it's okay buddy i know pizza always confuses you\" and gave him his treat anyways",
        source: "Kylie Cunningham on Twitter",
      },
      {
        text: "In 1992 I was 12. My dad and I were in the Newark airport. I saw Joe Pesci and recognized him from HOME ALONE. I went up to him to ask for his autograph. Joe asked me who my favorite actor was. I said he was. He handed me a crisp $100 and said \"That's the right answer, kid\".",
        source: "Rod Blackhurst on Instagram",
      },
      {
        text: "What do we mean by saying that existence precedes essence? We mean first of all that man exists encounters himself, surges up in the world - and defines himself afterwards. If man as the existentialist sees him is not definable, it is because to begin with he is nothing. He will not be anything until later, and then he will be what he makes of himself. Thus, there is no human nature, because there is no God to have a conception of it. Man simply is. Not that he is simply what he conceives himself to be, but he is what he wills, and as he conceives himself after already existing - as he wills to be after that leap towards existence. Man is nothing else but that which he makes of himself. That is the first principle of existentialism.",
        source: "Jean-Paul Sartre - Existentialism is a Humanism lecture",
      },
      {
        text: "假如\n你能把重要的事做完\n別人有看到你在自我學習\n別人看到你在學習做事, 即便你不確定該怎麼做\n你無私地和人分享你所學的東西\n你不隱藏你的無知, 也不安於你的無知\n你尊重別人所知道的\n你通常知道如何找到你所不知道的東西\n你知道如何尋求幫助\n你幫助別人的幫助, 而且是以他的方式幫他們\n\n那麼\n沒人會在意你的成功是來自自學或是已知的知識\n沒有會在乎你偶爾的失誤\n沒人會在意你在某個時間不知道某種特定知識",
        source: "James Bach - Secrets of a Buccaneer-Scholar",
      },
      {
        text: "My mother died of cancer when she was 48. On her deathbed she offered her regrets: \"I hate that I spent so much time at work and didn't get to know my children. I hate that I spent so much time dieting and didn't get to eat my favorite foods. I hate that I spent so much time worrying about whether the house was clean. I hate that I spent so much time worrying about what people who didn't care about me thought about me. Just have a peaceful life; nothing else matters.\"",
        source: "@SpecialDogsNeedLoveToo - 留言",
      },
      {
        text: "My Dad got a PhD in his 40s, wrote a book in his 50s, started a business enterprise in his 60s and is heading toward 70 and is calm, fit and healthy. He told me that compared to the Earth we are children, there is no such thing as old age, it's how you feel and live.",
        source: "@mirtze4876 - 留言",
      },
      {
        text: "I serve this cute old man and woman everyday and today I asked them how long they've been married. they smiled at eachother and he said \"honey, we aren't married, she's my bestfriend. ever since my wife and her husband have passed, we take care of eachother. she is all I have\"",
        source: "@c.utenotes - Instagram story",
      },
      {
        text: "那留言說我們一開始其實都只看事物的表面，並沒有太深入去探討背後的意思，因此常常被人笑，而後來當我們長大後，懂的事物越來越多，對於每一件事都會努力探討背後的含意，即使本來就沒有那樣的意思。\n\n而在不斷的折磨自己之後。\n\n我們才學會當遇到某些事時，不再試著深究，也不在深陷其中，不說破也不戳破，讓彼此的心得以喘息。\n\nThe comment says that initially, we all tend to only see the surface of things and don't delve too deeply into the underlying meanings. As a result, we often become the subject of ridicule. However, as we grow older, our understanding of things grows, and we make an effort to uncover the hidden meanings behind everything, even when there might not be any.\n\nAfter subjecting ourselves to continuous torment, we eventually learn that when faced with certain situations, we no longer try to dig deeper or get trapped in them. We choose not to expose or probe further, allowing each other's hearts to take a breath.",
        source: "@fpcchannel.tomi",
      },
      {
        text: "It might be taking you a little longer because you aren't lying, scamming, manipulating, using people, or selling your soul. Stay the course, your time is coming soon. 🙏",
        source: "@manishgandhi10",
      },
      {
        text: "little by little is better than nothing at all.",
        source: "e.russell - @the.littlebeast",
      },
      {
        text: "No matter how bad you think your life is, it's someone else's fairy tales. Give thanks for what you have.",
        source: "@edina.fit - Weekly round up",
      },
      {
        text: "let's call today \"Make It Happen Monday\". Tell me something you're going to make happen this week, this month, this year or even in your lifetime. Are you going to pull up? Learn to play the flute? Put it out into the world, put your head down and make it happen. ❤️",
        source: "@kellymatthews - Instagram story",
      },
      {
        text: "The hardest and most important decision you can ever make is to choose yourself.\n\nIt may mean you upset some people in your life. You'll raise eyebrows. You'll be gossiped about. It will be hard.\n\nSo f*cking what?\n\nThe only thing that you have to lose is the weight of everybody else's opinions. What you have to gain is freedom.\n\nYour happiness is more important than anyone else's opinion about it.",
        source: "@melrobbins - Instagram story",
      },
      {
        text: "The first to apologize, is the bravest.\n\nThe first to forgive, is the strongest.\n\nThe first to forget, is the happiest.",
        source: "@elite.mindsets - Instagram",
      },
      {
        text: "When you focus on problems, you get more problems. When you focus on possibilities, you have more opportunities. — Zig Ziglar",
        source: "@lessonsin30s - Instagram comment",
      },
      {
        text: "最開始討論關於自己的哲學問題，而這常常就是哲學最根本的哲學問題\n\n「我不想在這裡討論過去一些偉大的哲學作品，或是這些作品的文化背景。哲學的核心在於心靈問題，是關於生命的核心思考。所有在原子和數學層次的問題，都來自我個人的困惑，都來自於我們對生命的關注，這一切，都來自於由於哲學而出現的問題。」- What Does It All Mean? By Thomas Nagel\n\n最開始的哲學問題是自己的哲學問題，而這常常就是哲學最根本的問題。我不想研究那些過去大師的經典或作品，但我們可能會討論一些主題。就來，等哲學家一起談討論。既然要尋找為什麼，那就要深入去探討背後的意思，因此常常被認為比較嚴謹，而後來當我們長大後，懂的事物越來越多，對於每一件事都會努力探討背後的含意，即使本來就沒有那樣的意思。或會我們要努力指出在某討論背後的意思，新的想法。\n\n哲學是低門檻的學問，而這學問最重要的門檻便是你能勇敢地、誠實地自己反省與思考。這是「學問是為己之學」的重要內涵。\n\n我們的社會思想之所以不能大步向前，我認為，主要是因為我們的學術型態是太多屬於「詮釋型的思想」，陷溺在詮釋別人的工作上，相互比較誰的詮釋比較正確、比較創新，不能問出新的問題，提不出新的假說、新的想法。\n\n學術要創新，思想要創新，就要養成創新的習慣，在每一次筆記中都勉強自己，用自己的語言自己的話，在每一次教育中，無論大小報告，都努力提出自己的看法，無論小意見或大理論。不要害怕犯錯，要害怕提不出新的想法。\n\n過去的、既有的理論自然要參考，但是它們是你創新的基礎、註腳與助力。不要僅僅成為哲學家(思想家)的詮釋者，要努力成為哲學家(思想家)。",
        source: "林從一 on Facebook - 2014",
      },
      {
        text: "（繁花）說得虛空：\n\n\"以前一直以為，人是一棵樹，以後曉得，其實，人只是一張樹葉。到了秋天，就落下來，一般就尋不到了。因為眼睛一霧，大家總要散的，樹葉，總要落下來。\"\n\n但樹葉也不是那麼蕭條虛空，一棵樹是一棵樹，樹葉有一家子，只要活著，常活得熱鬧。\n\n的確，樹葉總要落下來，但總要落下的還有繁花，繁花有果子的希望，果子可以長成樹。\n\n縱然萬花百果無一存樹，此生此世，也要活得花美果甜。",
        source: "林從一 on Facebook - 2024年1月20日",
      },
      {
        text: "Going from being worried about what might happen to being excited about what might happen is only a mindset shift away.",
        source: "@heycoryallen - @the.littlebeast",
      },
      {
        text: "My daughter, when she was younger, got invited to the birthday party for one of the kids at her day care. I didn't know the kid or her parents, maybe they were new, but everyone at the day care was cool and my daughter was never one to turn down a party, so we went.\n\nIt was at a McDonald's which was odd bc most of the parents at the daycare threw \"rent out the children's museum\" parties. (We're not rich but the daycare was in a.... well-off town).\n\nWhen we walked in we saw the birthday girl and her brother sitting at a table with some people who were probably uncles - no other kids. The birthday girl popped up in delight when she saw my daughter.\n\nLuckily my daughter is like the social director on a cruise ship so she only needs like a couple of sticks, a few crayons, and one or two other people to make a party with shockingly high production value and a robust storyline. No idea where she got that from, my personality is terrible.\n\nThat girl, her brother, and my kid played for about 2 hours straight at full volume. Her dad was so thrilled that he kept offering to buy me food. And at one point I might've caught a glimpse of her mom having a brief happy cry in the hallway, but if I did, I pretended i didn't.\n\nSometimes, one friend is more than enough to make a day special.",
        source: "Graphitetshirt - Reddit",
      },
      {
        text: "The best thing about life is that everything I've ever lost, has been replaced with something better.\n\nI never lack, I just transition",
        source: "the.littlebeast on Instagram",
      },
      {
        text: "《琅琊榜》中蕭景睿和梅長蘇的這段對話，十分感人。他說，\n「凡是人，總有取捨，你取了你認為重要的東西，捨棄了我，這只是你的選擇而已。\n若是我因為沒有被選擇，就心生怨恨。\n那這世間豈不是有太多不可原諒之處。\n畢竟誰都沒有責任，要以我為先，以我為重。\n無論我如何希望，也不能強求。\n我之所以這麼待你，是因為我願意。若是以此，換回同樣的說心，固然可喜。\n可若是沒有，我也沒有什麼好後悔的。」",
        source: "深度好文讀不完 on Facebook - 《琅琊榜》經典台詞",
      },
      {
        text: "賭場破產的可能性；而破產了，已經輸了就再也贏不回來了，只能出局。賭場的本錢還比你的賭本多得多，它可以輸給你非常非常多次而不破產，但是，你只堪得翻幾把或幾十把，再輸就精光，再拗，就欠債。\n\n這是賭場教我的一堂課：透過厚實你的財富、氣度、心力、修養或聲望，讓你成為可以輸1,000次、10,000次仍不垮的人，讓你成為輸得起的人。\n\n許多看起來很強大的人或政黨或團體或公司，不斷的贏，贏了1,000次、10,000次，但卻是1次都輸不起，輸1次就垮了。這種人或政黨或團體或公司會一直活在恐懼中。想一想，為什麼贏了那麼多，卻一次都輸不起？\n\n問問自己，撐持甚麼樣的心念，抱持甚麼樣的希望，實踐甚麼樣的理想，會讓你成為失敗卻仍舊提立的人？",
        source: "林從一 on Facebook",
      },
      {
        text: "第一個救贖，是我先生跟我說的\n\n他很認真的看著我，一字一句的說：「偷姬，根本沒人在看你，沒有人！」\n\n「如果有，你管他們去死，根本不管你的事啊！」\n\n那天在上海，我們在南京東路的Marriott，從高樓層看著底下人來人往的人走過，這兩句話魔幻的釘在我的腦海中。\n\n第二個救贖，是我自己學會的一句話\n\n當因為某件事情的不確定性，導致焦慮時，只要一直問自己：這件事失敗了會怎樣呢？\n\n當把所有可能性想過一遍\n發現最差也就是那樣\n心中的焦慮就會大幅減低\n\n第三個救贖很好笑，是我妹妹\n\n她現在有非常優秀的工作，超忙碌，超搶手。但前幾年，她也有待業在家的時候。\n\n當時她翹著二郎腿，軟爛躺在沙發時，幸福的說：「我的夢想就是當一隻米蟲♡」\n\n「快樂的米蟲♡」\n\n當時我都震驚了！\n\n活成這樣都可以如此理直氣壯，如此快樂，我還有什麼理由覺得自己做不好，要歸咎自己，要焦慮呢😂\n\n原因是關鍵的三句話。",
        source: "peggy_lov on Instagram",
      },
      {
        text: "公告標題：系主任的話\n消息來源：化學系辦公室\n----------------------------------------\n各位同學：\n\n你欠生命一份奇蹟。\n\n生命是甚麼？它的開始，伴隨著各種期待與希望；它的結束，不管是用任何一種方式，都會帶來迴響，就像不同樂章結束時一樣。偉大也好，渺小也好，在迴響中，傷感的情緒，或早或晚，都會隨時間消逝；留下的，才是最珍貴的部份，也就是我們留在別人心中的足跡。\n\n活著是甚麼意思？對數十年沒見的同學而言，我活著與否，其實分別不大。所以，如果我活著，卻沒有活在別人的心中，那麼我活著又有何意義？這些年來，面對一次又一次生命的告別，我在思潮起伏中驀然發現，原來活著的意義，是在乎如何活在別人的心中。在春夏秋冬的循環中，在許多的悲歡離合之間，我們才會真正領悟活著的意思：人與人之間，縱然是萍水相逢，若在心中存留著美好，就會被記念。在重重思念的交織中，我們才會看到那兩個字——意義。\n\n去年十月我曾跟你們說，生命是一個奇蹟，但沒有所有同學都聽進去。請容許我再重覆一次，生命是一個奇蹟。奇蹟的意思，是在於它的不可預測的屬性。魯迅說：「絕望之為虛妄，正與希望同。」我們都曾經歷過滿懷希望，但結果卻不如預期的失落；但同樣真實的是，當我們感到絕望時，生命卻往往會出現奇蹟。前者我們很明白，因為期待會帶來等待；後者則不然，因為我們以為絕望就是終點。但，生命是個過程，它不需要理由，只需要等待。我們常誤以為等待必須要有理由，卻不知道，等待的本身就是理由，因為它是奇蹟發生的前題。絕望是心理狀態的投射，是從個人有限的知識作的主觀判斷；當我們以為日復一日，周遭毫無改變的可能時，意料之外的事情，總會在出人意表的時間發生，所以那裡有生命，那裡就有奇蹟；帶著此信念的等待，叫作忍耐。請不要問為何要忍耐，因為愛是不需要理由的。愛是恆久、忍耐，又有恩慈……。\n\n若你真的要問為甚麼要忍耐，我只好直白的說，你欠的！\n\n你沒有欠誰，我也沒有說你要為誰而活。我是說，生命形成的過程至今仍是個巨大的奧秘，請不要把自己的存在視作等閒 (taking it for granted)。我們身體內的化學世界極其廣濶，以坐井觀天來形容我們目前對此的知識絕不為過；同樣，你們未來的世界也是極其寬廣的，你們真的還年輕，不要現在就下定論說未來已不值得期待。各位同學，你們都是化學人，應該很清楚價值判斷與事實判斷的巨大分別，兩者就像kinetics與thermodynamics一樣，不能混淆。你可以沮喪，可以失落，那是情緒，那是個人的價值判斷；不管你心情如何，你身體中的化學反應依然在運作，未來對你依然是一個迷。生命的本體與意義既是如此深邃，道德上你真的有責任去經驗它的一切，包括我說的奇蹟。\n\n我絕沒有暗示生命中只有美好，事實上人生不如意事十常八九：家庭、同儕、愛情、研究、指導老師等都可以令你感到失望，不過成熟的意思，就正正在於只想一二，不問八九。在古典的成核理論，晶體成核的過程都有一個能障。能障的最高處，核種大小的演化是一維的擴散運動。能穿越此能障，後續就是成核長晶，不然，就是回溶分解。令我驚訝的是，如果此能障的至高處是相對平坦及寬闊，能穿越其中的概率會大幅下滑，當然此結果是有嚴謹的理論支持的。我只是想到，人生不就正是如此嗎？如果我們人生一直都平坦順遂，每件事都可以完美的完成，我們如何穿越成長的屏障？在你明白為何「大成若缺」之前，請好好忍耐，不要每件事都要求完美。學習與失望、挫折共存，給自己一個機會成長，那也是給自己一個經歷奇蹟的機會。\n\n最後，對尚未成為父母的你們，我還有一句話：不管你的家庭背景如何，養育兒女的艱辛是你無法想像的。雖然你的父母沒期待任何回報，但他們值得你回饋的，應該是感恩，而不是傷害。請好好珍惜自己，因為在他們的心中，你是那不可替代的唯一。只要他們仍在，請不要作任何令他們痛不欲生的行為。\n\nJerry",
        source: "https://www.facebook.com/share/p/172ysuzaQN/",
      },
      {
        text: "有時間絕望 還不如去吃美食然后睡个覺\n\n絶望してる暇あったら うまいもの食べて寝るかな",
        source: "日劇截圖",
      },
      {
        text: "Maggie Smith was \"old\" for my entire life. The first time I saw her as a kid, she was playing an Granny Wendy in Hook. I didn't know she was wearing prosthetics and only in her 50s. She always seemed so comfortable in those older roles. Her Wendy was magnetic, with a sharp vitality but also a sorrow for a lost Neverland. She brought that quality to her most famous roles, a conservative Mother Superior in Sister Act, Professor McGonagall, or the matriarch of Downton Abbey—characters yearning for or protecting an old world, even as her eyes told us she knew the future was already here.\n\nActresses often go to drastic measures to look 35 well into their 60s, but there was an ageless, iron dignity to her wrinkles. In our youth-obsessed culture, it's jarring when an artist who has been around this long dies. It feels like they take a piece of our youth with them when they pass. Maggie takes with her a peace about aging.",
        source: "Leo Herrera on Facebook",
      },
      {
        text: "After months of banging my head against the wall thinking of how life is meaningless, today I stopped and just decided to take in everything around me. It was a pleasant evening and, I was commuting home listening to electronica on my headphones, and for no reason at all, suddenly began looking out the window in awe. Look at those cool mountain-things in the distance! Look at that funny neon green car that just passed me by! I suddenly forgot all of my worries and it all just felt so cathartic for no reason at all. Not even the fear of death could ruin my joy in that moment, and I've been wrestling with it for so long: In fact, all I could think of was how much time I still have left here, to enjoy all of this random nonsense, for its own sake and fully. I finally learned to live in the present, in spite of the absurd.",
        source: "r/Absurdism - u/therealonly ed",
      },
      {
        text: "昨天看《黑白大廚：料理階級大戰》韓國名廚對戰挑戰者前的受訪，我認為非常受用。\n\n「要是被淘汰，大概一年不上網就好。」\n\n沒錯，生活中的煩惱，九成都來自上網害的。🤡",
        source: "藍白拖 on Facebook",
      },
      {
        text: "If you have the power to eat alone in a restaurant, or sit alone in a cinema, then you have the power to do absolutely anything you want in life",
        source: "Daniel Craig",
      },
      {
        text: "There is always some kid who may be seeing me for the first or last time, I owe him my best.",
        source: "Joe DiMaggio",
      },
      {
        text: "We don't need to increase our goods nearly as much as we need to scale down our wants. Not wanting something is as good as possessing it.",
        source: "Donald Horban",
      },
      {
        text: "Hegel reminds us that big overreactions are eminently compatible with events broadly moving forward, in the right direction. The dark moments aren't the end. There are a challenging, but even in some ways necessary parts of antithesis, that will, eventually, find a wiser point of synthesis.",
        source: "https://youtu.be/q54VyCpXDH8",
      },
      {
        text: "Why are all your causes so steeped in gloom? Because it's the gloomy things that need our help. If everything in the garden's sunny, why meddle?",
        source: "Downton Abbey",
      },
      {
        text: "She's been an absolute ruler there for long enough. It's time for some loyal opposition.",
        source: "Downton Abbey",
      },
      {
        text: "When I misplay something publicly and I feel like everyone's staring at me, I take comfort in this fact: most people are self-absorbed narcissistic assholes. So they might revel in your shit for a minute, because it distracts them from theirs. But after that minute, they're gonna forget about you.",
        source: "Billions",
      },
      {
        text: "I'm not sure what will happen, but whatever it is, it's better than being afraid.",
        source: "Downton Abbey",
      },
      {
        text: "And alchemy is the key word here, because the erotic frisson is such that the kiss that you only imagine giving, can be as powerful and as enchanting as hours of actual lovemaking.",
        source: "Esther Perel",
      },
      {
        text: "It is our imagination that is responsible for love, not the other person.",
        source: "Marcel Proust",
      },
      {
        text: "Remembering that you are going to die is the best way I know to avoid the trap of thinking you have something to lose. YOU ARE ALREADY NAKED. There is no reason not to follow your heart.",
        source: "Steve Jobs",
      },
      {
        text: "Sometimes I feel like I just went through the four best years of my life, only I forgot to make them the four best years of my life.",
        source: "Modern Family - Alex character",
      },
      {
        text: "You would never allow yourself to take it in, to appreciate it, because that would mean acknowledging you'd done well, succeeded, won the game. That there was a place to pause. Or stop. Is it a game can be won? The answer to that is a philosophical axiom — true without needing to be proved: When you decide you've won, you've won. Until then, no.",
        source: "Billions",
      },
      {
        text: "Sometimes it's easy to forget that we spend most of our time stumbling around in the dark. Suddenly a light gets turned on, and there's a fair share of blame to go around.",
        source: "Spotlight",
      },
      {
        text: "我的諮商心理師總是告訴我，將「如果」這個詞換成「即便」。這意味著，即使那件事情真的發生了，我也能應對自如。",
        source: "r/AskReddit - 應對焦慮方法分享",
      },
      {
        text: "最好的結果\n\n大家都希望有好結果，有時候覺得有些事無論如何都要有好結果，甚至無論如何都要有最好的結果。\n但是，關於結果，存在著許多不同觀點。在每一個結果中都要看見它的種子。\n\n大凡(一般人)：我要好結果\n不凡(出類拔萃的一般人)：我只要最好的結果\n願(立了志的人)：盡了力，什麼結果都是最好的結果\n大願：什麼結果都是最好的結果\n覺者：什麼結果都是唯一的結果\n\n精益求精的人：拿在手上的都不是最好的結果，每次都能更好。\n\n我：1985年9月8日武陵農場果四區清晨6點鐘樹上那顆4A沁心涼的白鳳水蜜桃。兩手捧它在手上，彷彿捧著春夏秋冬。",
        source: "林從一 on Facebook",
      },
      {
        text: "我老闆在高壓環境中總是非常冷靜、從容。不管事情多麼混亂，老闆總能保持平靜。我問老闆為什麼，老闆回答：「總有一天，你愛的人會去世，那時其他一切都會變得無足輕重。」\n\n這是一種非常灰暗的方式來表達「人生短暫，沒必要總是慎怒，悲傷或給自己太大的壓力」，但它直指該心，這句話一直在我腦海中徘徊。",
        source: "r/AskReddit - 最佳人生建議分享",
      },
      {
        text: "Sheldon's favorite number is 73, because 73 is the 21st prime number. Its mirror, 37, is the 12th and its mirror, 21, is the product of multiplying 7 and 3. In binary 73 is a palindrome, 1001001, which backwards is 1001001. In real life, Jim Parsons, who plays Sheldon was born in 1973.",
        source: "Big Bang Theory Unseen",
      },
      {
        text: "生活的幸福感，與金錢本身沒有直接關係，跟自我實現比較有關。\n\n只有自我實現了，更好的生活才會隨之而來。\n\n人之所以能感到幸福，其實不在於生活的有多舒適，而是因為生活的有希望。\n\n期盼的生活，不應該是打敗了多少人、上升到什麼階級、賺了多少錢，而是在每天睡前，會覺得今天沒有白過，對明天還有期待，前有遠方，後有歸宿。\n\n在社群網站發達的今天，大家的思維越來越以自我為中心。\n\n大家都很忙，根本就沒人在乎別人是否功成名就。\n\n只有莫名高估自己的人，才會太在意別人的眼光。",
        source: "關於生活幸福的思考",
      },
      {
        text: "Sometimes it's the very people who no one imagines anything of who do the things that no one can imagine.",
        source: "The Imitation Game (2014) - Benedict Cumberbatch",
      },
      {
        text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
        source: "Mahatma Gandhi",
      },
      {
        text: "今天下午明顯感覺到週期性的情緒低落，早早跟業主確認工作結束後，我就獨自一人走了一個小時，往勤美的方向散步。\n\n剛剛在勤美，過馬路前，遇到這個阿北說要賣我最後的兩包雞蛋糕100元，但我真的身無分文（只帶了信用卡出門），所以我說：\n\n「沒關係，不然你等我去領個錢！」\n\n然後他就說：\n\n「那就送你，我都沒在怕你不來了，\n你有什麼好怕的！\n你下次有經過想來付錢再來。\n我今天生日，想早點下班回家過生日。」\n\n他還說還收拾他的腳踏車，\n我用台語祝他生日快樂，\n拍下照片後他就騎走了。\n\n等下週二他開攤再來買雞蛋糕吧，謝謝你，\n今天本來是糟透的一天，但現在不是了。\n\n跟朋友說被阿北拯救了，但他說我也拯救了想下班的他，又是跟世界互相拯救了的一天，可以的話，我還想繼續在這樣的台灣，生活好久好久。",
        source: "namelessrong on Instagram",
      },
      {
        text: "沒有人能夠失去另一個人，因為沒有人真的擁有另一個人。這是自由的真實體驗：在這世上有你最重要的事物，但你沒有它的控制權。",
        source: "Paulo Coelho - Onze Minutos (2003)",
      },
      {
        text: "Don't lie and say you are a Jim or a Pam. We are all Stanleys.\n\nI don't care.\nI'm leaving nothing.\nI'm on a break.\nI'm going to die.\nI have good news. :We got to go home?",
        source: "The Office - Stanley Hudson",
      },
      {
        text: "A few years ago I did a road trip through the Canadian Rocky Mountains. There are so many Swiss people there! I couldn't believe it. We saw Swiss and Cantonal flags flying over so many farms and cabins.\n\nThere was a perfect brown Alpine-style log home with an Uri flag flying. They had a sign advertising, basically, a hofladen. We got to chatting, and asked why there seemed to be so many Swiss people in the region. Easy answer: they loved mountain / farm life, but land in Canada cost a fraction as much as it did in Switzerland. They were able to buy their \"alpage\" and build their \"chalet\" in their early 30s, instead of never.",
        source: "r/askswitzerland - backgammon_no",
      },
      {
        text: "不能沒有執念\n\n學生請我再說明：\n\n\"不要追求客觀\n也不要與多數妥協\n重要是的掌握你最無私的主觀\"\n\n我以執念來解釋。\n\n人們常說，放下執念，放下自我，與自己和解，太多的自我像戴着枷鎖兜圈圈地走，疲累無望。\n\n沒有比\"自我\"更沉重的東西了。\n\n人們說，要相信科學，要相信民主，放下自我，放下執念，客觀與大我讓人自由。\n\n但那樣說，容易誤導人。實然導不出應然，全宇宙的知識，也無法告訴你下一步應該怎麼走；投票箱裡充滿妥協，而人有太多不能妥協的東西。\n\n人還是要執念\n沒有執念，不知道自己是誰，要往何處去\n但這執念\n不是為了自己的執念\n而是為了比自己更美好事物的執念\n\n執念決定自己，但不是為了自己，這最無私的主觀的核心其實就是大愛(agape)。",
        source: "林從一 on Facebook",
      },
      {
        text: "失敗的人常常覺得自己是世界上最蒼老的人，還有著最長的餘生要過。（這句改寫自 Nella Larsen, Passing）\n\n但是，絕大部分的比賽（物競天擇式的除外），主辦單位只獎賞勝利者，不懲罰失敗者，不能說是故意的，主辦單位就讓失敗者自己去面對失敗。\n\n失敗者受到的懲罰大多來自失敗者自己，而不要以為自己懲罰自己就知道注意下手輕重，常常最重的懲罰是自我懲罰。\n\n無論如何，自己懲罰自己，自己能決定多重多久，太重太久就太傻了。",
        source: "林從一 on Facebook",
      },
      {
        text: "最早版本 NDS 的動物之森居民講話的詞彙更多\n那時候我也不喜歡一個居民 我就寄信給他還附上垃圾\n一直寄直到有一天他寫信給我\n\n說「我不知道我做了什麼 但是你好像十分討厭我\n雖然我還是很喜歡你 不過也許也該到我離開的時候了」\n\n收到信的時候他已經離開了\n\n這是我在遊戲世界裡最後悔的一件事\n也變成了我的創傷",
        source: "12_cold_water on 回覆",
      },
      {
        text: "'I'll get over it' - my aspiration for a life of zero drama and maximum chill 😂😂😂",
        source: "queenanthonycosmetics",
      },
      {
        text: "前景理論讓我著迷。它指出，我們其實對「失去」這件事比「得到」更有感。甚至在心理上，損失的痛苦大概是等值收穫的兩倍。\n\n也因此，很多時候人會做出極端的選擇，不是為了贏更多，而是為了不要輸。為了不失去，我們反而更願意冒險，哪怕那風險根本不值得。",
        source: "r/AskReddit - ExistentialMeme",
      },
      {
        text: "2025都已經快過完了，複習一下年初給自己設的提醒。All of these still hold true to me.\n\n\"提醒自己在2025記得以下：\n1. 大部分的不開心都是不健全的制度體系所導致。不是你的問題。\n2. 你已經不是學生了，不需要無條件接受和服從掌權者的命令；也不需要一味追求外界對自己行為的評比。你有價值。\n3. 一個人的官位和權利再怎麼大，拋開所處的脈絡，也就是個人。不要造神。\n4. 不要一廂情願。不是所有人都願意被救。\n5. 沒有工作以外的興趣愛好，把工作當成自己最大的成就感來源，甚至用來自我實現和自我認同，是可悲的。\n6. 你有權力去選擇自己想要過的生活。但切記，每個決定都有得失。\n7. 決定什麼都不做，也是一種決定。\n8. 想要改變世界之前，先把自己照顧好。在沒有照顧好自己之前，別妄想要做什麼一番大事業。\"",
        source: "randomwholefoodssafeway",
      },
      {
        text: "The days are long, but the years are short.",
        source: "Gretchen Rubin - The Happiness Project",
      },
      {
        text: "There's a song by Baz Luhrmann called Sunscreen.\n\nHe says worrying about the future is as effective as trying to solve an algebra equation by chewing bubble gum.\n\nThe real troubles in your life will always be things that never crossed your worried mind.\n\n---\n\nPart one of the two part plan was that I should just get on with ordinary life, living it day by day, like anyone else. But then came part two of Dad's plan. He told me to live every day again almost exactly the same. The first time with all the tensions and worries that stop us noticing how sweet the world can be, but the second time noticing.\n\n---\n\nThe truth is, I now don't travel back at all. I just try to live every day as if not even for the day. I've deliberately come back to this one day to enjoy it as if it was the full final day of my extraordinary, ordinary life.\n\n---\n\nWe're all travelling through time together every day of our life. All we can do is do our best to relish this remarkable ride.",
        source: "About Time (2013)",
      },
      {
        text: "有隙可乘，總好過無懈可擊\n\n世間之物多不可強取，但可迂迴",
        source: "羋月傳",
      },
      {
        text: "對於當時的我們來說，目標從來都不遙遠，一步步一天天，只管全力以赴，剩下的交給時間",
        source: "繁花",
      },
      {
        text: "我們那時候都是這麼走過來的，這就叫摸著石頭過河。那個時候，什麼叫公司，什麼叫企業，我們什麼都不知道。我們只知道，下了海，你就要使勁地划，划到哪裡是哪裡。你看似人海茫茫，天地寬闊。實際上，你只要記住兩個事情。第一，你要活著回到岸上，不能死。第二，順手能撈什麼你就撈什麼，不至於空手而回。你現在跟我當時，情況是一式一樣的。保命要緊，哪怕多跑兩趟，哪怕多花點力氣，你力氣花光了，你睏一覺他就漲回來了。時機錯過了，那就什麼都沒了。",
        source: "繁花",
      },
      {
        text: "When we frame them as opportunities we're more likely to do them, experience them and helps us learn, grow and get better over time.",
        source: "How to 'overcome' fear | Trevor Ragan | TEDxCedarRapids",
      },
      {
        text: "Being a generalist at the start really makes you feel like you're falling behind.\n\n\"A jack of all trades is a master of none, but oftentimes better than a master of one.\"\n\nWhen thinking about life, remember this: No amount of guilt can solve the past, and no amount of anxiety can change the future.",
        source: "How Falling Behind Can Get You Ahead | David Epstein | TEDxManchester",
      },
      {
        text: "100% commitment is easier than 98% commitment.",
        source: "The 100 Percent Rule That Will Change Your Life | Benjamin Hardy | TEDxKlagenfurt",
      },
      {
        text: "The best advice I've heard is \"Compare yourself to who you were yesterday\" and \"Act as if you are watching yourself\" and \"Treat yourself like someone you're responsible for taking care of.\"",
        source: "Why 30 is not the new 20 | Meg Jay",
      },
      {
        text: "What's your wish? What's your obstacle? We are problem solving humans, people want to help.\n\nSecret to success: isolation is a dream killer. You can't fake feelings.\n\nWe depend on each other's dreams coming true. Every single time you make someone else's dream come true it echoes. Figure out what you want, let people help you, go after your dreams, figure out your dreams and obstacles.",
        source: "Isolation is the dream-killer, not your attitude | Barbara Sher | TEDxPrague",
      },
      {
        text: "Seduction is really about your untapped power that you're not using, that you want to unleash.\n\nOne of the most charming things that I've noticed about Cuban men, is how they go after what they want completely fearless of the consequences of getting hurt or getting rejected.\n\nI really believe that seduction leads to self-confidence, and self-confidence leads to success in all areas of your life. Master seduction and you can have anything that you want in life.",
        source: "The power of seduction in our everyday lives | Chen Lizra | TEDxVancouver",
      },
      {
        text: "Boldness is the stronger indicator of success than intelligence.\n\nYou chase what you want and you don't take what you can get. The problem is most of us live on default, we default to what's convenient we take what's available and we acquiesce to what's in front of us.\n\nWhen you are comfortable with asking for the small things in life it gives you the skills the habit and the confidence to ask for the big things in life.\n\nSo how do you practice failing 9 out of 10 times or how you get comfortable failing 9 out of 10 times, and the answer is practice.",
        source: "The Secret to Getting Anything You Want in Life | Jennifer Cohen | TEDxBuckhead",
      },
      {
        text: "Let them.\n\nStay in your peace, stay in your power.\n\nThe fastest way to take control of your life is to stop controlling everyone around you.\n\nUnderstanding yourself and understanding your default thinking patterns and doing the work to challenge those assumptions and change the way that you think.",
        source: "YouTube Video - https://www.youtube.com/watch?v=iEo48f_Rs4w",
      },
      {
        text: "What makes us happy is agency. Knowing that we have some sort of control over what's going to happen in our life.\n\nYou can't be curious and angry at the same time.",
        source: "WisdomBread 智慧麵包 - https://www.youtube.com/watch?v=md6E-wgq4Js",
      },
      {
        text: "It's always hard going through a break-up when the other person has made just like, the objectively correct decision.",
        source: "YouTube Video - https://www.youtube.com/watch?v=gR9izDp89c0",
      },
      {
        text: "Because you don't know what's going to happen. It's called fear of the future, or \"fof\" or \"fotf.\" Think about time travel. If you could go forward in time and turn around and look at this moment, we would say, \"This is all super chill.\"",
        source: "Modern Family",
      }
    ]

    console.log('Batch importing inspirations:', comments);

    try {
      const batch = writeBatch(this.firestore);
      const collectionRef = collection(this.firestore, 'inspirations');

      comments.forEach((comment) => {
        const newDocRef = doc(collectionRef);

        // Debug: Log what we're about to save
        console.log('Saving to Firestore:', JSON.stringify(comment.text));
        console.log('Contains newlines:', comment.text.includes('\n'));

        batch.set(newDocRef, {
          content: comment.text,
          source: comment.source
        });
      });

      await batch.commit();
      console.log('Successfully batch imported inspirations to Firestore');

    } catch (error) {
      console.error('Error batch importing inspirations to Firestore:', error);
      throw error;
    }
  }
}